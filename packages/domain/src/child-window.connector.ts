import {
  filter,
  Fn,
  from,
  fromEvent,
  map,
  Observable,
  ResolvablePromise,
  share,
  switchMap,
  takeUntil
} from "@hypertype/core";
import {IAction} from "./model.stream";

export interface IConnector<TState, TActions> {
  Actions$: Observable<IAction<TActions>>;

  isDisconnected: PromiseLike<void>;

  Send(state: { state: TState });

  Send(response: { requestId; error?; response; });
}

export class ChildWindowConnector<TState, TActions> implements IConnector<TState, TActions> {

  constructor(private window: any) {
    fromEvent<MessageEvent>(globalThis, 'beforeunload').pipe(
      takeUntil(from(this.isDisconnected))
    ).subscribe(() => this.window.close());
  }

  // public isConnectedSubj = new Subject();
  public isConnected = new ResolvablePromise();
  // public isDisconnectedSubj = new Subject();
  public isDisconnected = new ResolvablePromise();

  public Actions$: Observable<IAction<any>> = fromEvent<MessageEvent>(globalThis, 'message').pipe(
    filter(event => event.origin == globalThis.origin),
    map(event => event.data),
    filter(Fn.Ib),
    switchMap(async data => { // Отработка специальных команд для Родительского окна
      const {type, childId} = data;
      switch (type) {
        case 'connected':
          this.isConnected.resolve();
          break;
        case 'disconnected':
          this.isDisconnected.resolve();
          break;
        default:
          return data;
      }
    }),
    filter(Fn.Ib),
    takeUntil(from(this.isDisconnected)),
    share()
  );

  public Send(result: {state: TState} | {requestId;error?;response;}) {
    this.isConnected.then(() => {
      this.window.postMessage(result, globalThis.origin);
    });
  }
}
