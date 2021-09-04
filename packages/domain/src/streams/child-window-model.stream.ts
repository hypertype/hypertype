import {filter, first, Fn, fromEvent, map, mergeMap, Observable, of, shareReplay, tap, throwError} from '@hypertype/core';
import {getMessageId, IAction, IInvoker, ModelStream} from '../model.stream';
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

  get id(): string {
    return globalThis.child.id;
  }

  get type(): string {
    return globalThis.child.type;
  }

  constructor() {
    super();
    if (!this.parentWindow)
      throw new Error(`parent window is missing`)
    this.hasOffscreenCanvas = 'OffscreenCanvas' in globalThis

    // => из Родительского окна пришло сообщение -> в Child-окно
    this.Input$ = fromEvent<MessageEvent>(globalThis, 'message').pipe(
      filter(event => event.origin === globalThis.origin),
      map(event => event.data),
      filter(Fn.Ib),
      tap(data => console.log(`ChildWindowModelStream.onMessage`, data)),
      filter(event => {
        if (event.data?.childWindowId) // ЕСЛИ сообщение пришло для конкретного окна
          return event.data.childWindowId === this.id;
        return true;
      }),
      shareReplay(1)
    );

    this.State$ = this.Input$.pipe(
      map(d => d.state),
      filter(Fn.Ib),
    );
    this.State$.subscribe();

    fromEvent<MessageEvent>(globalThis, 'beforeunload').pipe(
      tap(() => this.sendMessage({
        type: 'beforeunload',
        childWindowId: this.id
      })),
    ).subscribe();
  }

  private sendMessage(message, options?): void {
    this.parentWindow.postMessage(message, globalThis.origin, options);
  }

  // => из Child-окна отправляю сообщение -> в Родительское окно
  private hasOffscreenCanvas;
  public Action: IInvoker<TActions> = (action: IAction<TActions>) => {
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
