import {delayAsync, filter, first, Fn, fromEvent, map, mergeMap, Observable, of, shareReplay, switchMap, tap, throwError} from '@hypertype/core';
import {getMessageId, IAction, IInvoker, ModelStream} from '../model.stream';
import {TChildWindowRequest, TParentWindowRequest} from '../contract';
declare const OffscreenCanvas;

/**
 * Идея: в открепленном окне(Child-окно) нет воркера.
 * Родительское окно выступает в качестве прокси:
 *    Child-окно <--> Родительское окно <--> Воркер родительского окна
 */
export abstract class ChildWindowModelStream<TState, TActions> extends ModelStream<TState, TActions> {
  public Input$: Observable<any>;
  public State$: Observable<TState>;

  public childId: string;
  public childType: string;

  get parentWindow() {
    return globalThis.opener;
  }

  constructor() {
    super();
    if (!this.parentWindow)
      throw new Error(`parent window is missing`);
    this.hasOffscreenCanvas = 'OffscreenCanvas' in globalThis;

    console.log(`child metadata on init`, [globalThis?.child.childId, globalThis?.child.childType]);
    const actionsOnReady = of(1).pipe(
      switchMap(() => this.waitForReady()),
      tap(() => {
        this.childId = globalThis.child.childId;     // сохраню в локальные переменные,
        this.childType = globalThis.child.childType; // т.к. при закрытии эти данные могут быть недоступны.
        console.log(`child metadata when ready`, [this.childId, this.childType]);
        this.requestToParent('connected'); // запрошу инициализационный стейт
      }),
    );
    actionsOnReady.subscribe();

    // => из Родительского окна пришло сообщение -> в Child-окно
    this.Input$ = fromEvent<MessageEvent>(globalThis, 'message').pipe(
      filter(event => event.origin === globalThis.origin),
      map(event => event.data),
      filter(Fn.Ib),
      tap(data => log(`Child.onMessage`, data)),
      filter(data => !data.childType || data.childType === this.childType), // сообщение для типа окон как у этого окна
      filter(data => !data.childId || data.childId === this.childId),       // сообщение индивидуально этому окну
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
      shareReplay(1)
    );

    this.State$ = this.Input$.pipe(
      map(d => d.state),
      filter(Fn.Ib),
    );
    this.State$.subscribe();

    fromEvent<MessageEvent>(globalThis, 'beforeunload').pipe(
      tap(() => this.requestToParent('disconnected')),
    ).subscribe();
  }

  requestToParent(type: TChildWindowRequest) {
    this.sendMessage({type, childId: this.childId});
  }

  private sendMessage(message, options?): void {
    log(`Parent.postMessage`, message);
    this.parentWindow.postMessage(message, globalThis.origin, options);
  }

  // => из Child-окна отправляю сообщение -> в Родительское окно
  private hasOffscreenCanvas;
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
        ...action,
        _id: id
      },
      this.hasOffscreenCanvas ? action.args.filter(a => (a instanceof OffscreenCanvas)) : []
    );
    return this.Input$.pipe(
      filter(d => d.requestId == id),
      mergeMap(d => d.error ? throwError(d.error) : of(d.response)),
      first()
    ).toPromise()
  };


  private waitForReady(durationMinutes = 0.5): Promise<void> {
    const isReady = () => !!globalThis.child;
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
        console.error(`init params in "globalThis.child" not fount, waited for ${durationMinutes} minutes`);
        reject();
      }
    });
  }

}

function log(...args) {
  if (globalThis.isDebugChildWindows)
    console.log(...args)
}
