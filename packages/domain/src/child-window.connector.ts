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

/**
 * Используется для соединения childWindow и modelProxy
 * для отправки состояния в childWindow и actions в домен
 */
export class ChildWindowConnector<TState, TActions> implements IConnector<TState, TActions> {

  private static Instances = new Map<any, ChildWindowConnector<any, any>>();

  public static closeAll(){
    for (const [key, connector] of this.Instances) {
      connector.window.close();
    }
  }

  constructor(private window: any, private childId) {
    if (ChildWindowConnector.Instances.has(childId)){
      ChildWindowConnector.Instances.get(childId).window.close();
    }
    ChildWindowConnector.Instances.set(childId, this);
  }

  private disconnect(){
    this.isDisconnected.resolve();
    ChildWindowConnector.Instances.delete(this.childId);
  }

  // public isConnectedSubj = new Subject();
  public isConnected = new ResolvablePromise();
  // public isDisconnectedSubj = new Subject();
  public isDisconnected = new ResolvablePromise();

  public Actions$: Observable<IAction<any>> = fromEvent<MessageEvent>(globalThis, 'message').pipe(
    filter(event => event.origin == globalThis.origin),
    map(event => event.data),
    filter(Fn.Ib),
    filter(data => data.childId == this.childId),
    switchMap(async data => { // Отработка специальных команд для Родительского окна
      const {type} = data;
      switch (type) {
        case 'connected':
          this.isConnected.resolve();
          break;
        case 'disconnected':
          this.disconnect();
          break;
        case 'action':
          return data.action;
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
