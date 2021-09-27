import {filter, first, Fn, fromEvent, map, mergeMap, Observable, of, shareReplay, tap, throwError} from '@hypertype/core';
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

  get parentWindow() {
    return globalThis.opener;
  }

  get childId(): string {
    return globalThis.child.childId;
  }

  get childType(): string {
    return globalThis.child.childType;
  }

  constructor() {
    super();
    if (!this.parentWindow)
      throw new Error(`parent window is missing`);
    this.hasOffscreenCanvas = 'OffscreenCanvas' in globalThis

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

    this.requestToParent('connected'); // запрошу инициализационный стейт

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

}

function log(...args) {
  if (globalThis.isDebugChildWindows)
    console.log(...args)
}
