import {delayAsync, filter, first, Fn, fromEvent, map, mergeMap, Observable, of, shareReplayRC, startWith, switchMap, tap, throwError, withLatestFrom} from '@hypertype/core';
import {IChildWindowMetadata, TChildWindowRequest, TParentWindowRequest} from '../contract';
import {getMessageId, IAction, IInvoker, ModelStream} from '../model.stream';
import {getTransferable} from '../transferable';
import {takeUntil} from "@hypertype/core";

/**
 * Идея: в открепленном окне(Child-окно) нет воркера.
 * Родительское окно выступает в качестве прокси:
 *    Child-окно <--> Родительское окно <--> Воркер родительского окна
 */
export abstract class ChildWindowModelStream<TState, TActions> extends ModelStream<TState, TActions> {

  public childId: string;

  get parentWindow() {
    return globalThis.opener;
  }

  constructor() {
    super();
    if (!this.parentWindow)
      throw new Error(`parent window is missing`);

    // необходимо гарантировать, что у Child-окна появились метаданные.
    const onMetadataReady$ = of(1).pipe(
      switchMap(() => this.waitForMetadataReady()),
      tap(() => {
        const {childId} = this.parseMetadata();
        this.childId = childId;
        this.requestToParent('connected'); // запросить инициализационный стейт
      }),
    );
    onMetadataReady$.subscribe();
  }

  private beforeUnload$ = fromEvent<MessageEvent>(globalThis, 'beforeunload').pipe(
    withLatestFrom(
      fromEvent<any>(globalThis.document, 'keydown').pipe(
        startWith(null),
      ),
    ),
    tap(([, keyboardEvent]) => {
      if (!this.isRefreshPage(keyboardEvent))
        this.requestToParent('disconnected');
    }),
  );

  // => из Родительского окна пришло сообщение -> в Child-окно
  public Input$ = fromEvent<MessageEvent>(globalThis, 'message').pipe(
    filter(event => event.origin === globalThis.origin),
    map(event => event.data),
    filter(Fn.Ib),
    tap(data => log(`Child.onMessage`, data)),
    tap(data => { // Отработка специальных команд для Child-окна
      switch (data.type as TParentWindowRequest) {
        case 'close':
          globalThis.close();
          break;
        default:
          return data;
      }
    }),
    filter(Fn.Ib),
    shareReplayRC(1)
  );

  public State$ = this.Input$.pipe(
    map(d => d.state),
    filter(Fn.Ib),
    takeUntil(this.beforeUnload$)
  );

  requestToParent(type: TChildWindowRequest) {
    this.sendMessage({type, childId: this.childId});
  }

  private sendMessage(message, options?): void {
    log(`Parent.postMessage`, message);
    this.parentWindow.postMessage(message, globalThis.origin, options);
  }

  // => из Child-окна отправляю сообщение -> в Родительское окно
  public Action: IInvoker<TActions> = (action: IAction<TActions>) => {
    switch (action.method) {
      case 'SetFontFactor': // Это инициализационные action'ы, а так как в родительском окне
      case 'Auth':          // воркер уже проинициализирован, то эти сообщения окажутся повтором.
      case 'LoadFonts':     // Значит их надо игнорировать.
        return;
    }
    const id = getMessageId(action);
    this.sendMessage(
      {
        childId: this.childId,
        type: 'action',
        action: {
          ...action,
          _id: id
        }
      },
      getTransferable(action.args),
    );
    return this.Input$.pipe(
      filter(d => d.requestId == id),
      mergeMap(d => d.error ? throwError(d.error) : of(d.response)),
      first()
    ).toPromise()
  };


//region Support

  private parseMetadata(): IChildWindowMetadata | undefined {
    const search = new URLSearchParams(globalThis.location.search);
    const metadataStr = search.get('childWindowMetadata');
    if (!metadataStr)
      return;
    return JSON.parse(atob(metadataStr));
  }

  private waitForMetadataReady(durationMinutes = 0.34): Promise<void> {
    const isReady = () => {
      const metadata = this.parseMetadata();
      return metadata && metadata.childId;
    };
    return new Promise(async (resolve, reject) => {
      if (isReady())
        resolve();
      for (let i = 0; i < 12 * durationMinutes; i++) {
        await delayAsync(5_000);
        if (isReady())
          break;
      }
      if (isReady())
        resolve();
      else {
        logError(`Child window metadata in url.search "${JSON.stringify(globalThis.location.search)}" not fount. Waited for ${Math.trunc(durationMinutes * 60)} seconds.`);
        reject();
      }
    });
  }

  private isRefreshPage(keyboardEvent): boolean {
    if (!keyboardEvent)
      return false;
    const {code, ctrlKey, metaKey} = keyboardEvent;
    return code === 'F5' ||
      (code === 'KeyR' && (ctrlKey || metaKey)); // на mac cmd+R
  }

//endregion

}

function log(...args) {
  if (globalThis.isDebugChildWindows === true)
    console.log('[child-stream]', ...args)
}

function logError(...args) {
  console.error('[child-stream]', ...args);
}
