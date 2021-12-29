import {
  distinctUntilChanged,
  filter,
  Fn,
  from,
  map,
  Observable,
  shareReplayRC,
  startWith,
  Subject,
  switchMap,
  takeUntil
} from "@hypertype/core";
import {IAction, ModelStream} from "./model.stream";
import {IActions} from "./model";
import {IConnector} from "./child-window.connector";

export class ModelProxy<TState, TActions extends IActions<TActions>> {

  private static lastUpdate: string;
  private ActionSubject = new Subject();

  private ShareState$ = this.stream.State$.pipe(
    shareReplayRC(1)
  );

  public State$: Observable<TState> = this.ActionSubject.pipe(
    startWith(null),
    switchMap(_ => this.ShareState$),
    distinctUntilChanged(),
    map(state => this.GetSubState(state, this.path)),
    filter(state => {
      if (!state || !state.lastUpdate)
        return true;
      return state.lastUpdate >= ModelProxy.lastUpdate;
    }),
    shareReplayRC(1),
  );

  public InvokeAction(action: IAction<TActions>) {
    return this.stream.Action(action);
  }

  public Actions: TActions = new Proxy({} as TActions, {
    get: (target: TActions, key: keyof TActions, receiver) => {
      // для примитивов
      if (typeof key !== "string")
        return () => null;
      if (key === "then") // работает await, тут надо сообщить, что нет метода .then
        return undefined;
      return target[key] || (target[key] = (async (...args) => {
        try {
          ModelProxy.lastUpdate = Fn.ulid();
          const res = await this.stream.Action({
            path: this.path,
            method: key,
            args: args,
            lastUpdate: ModelProxy.lastUpdate,
          });
          return res;
        } catch (e) {
          return Promise.reject(e);
        }
      }) as any);
    }
  }) as any as TActions;

  constructor(protected stream: ModelStream<TState, TActions>, private path = []) {
  }

  protected GetSubProxy<UState, UActions extends IActions<UActions>>(constructor: any = ModelProxy, path: keyof TState, ...paths: any[]): ModelProxy<UState, UActions> {
    return new constructor(this.stream.SubStream<UState, UActions>(), [
      ...this.path,
      path,
      ...paths
    ]);
  }

  private GetSubState(state, path) {
    if (!path.length || !state)
      return state;
    if (Array.isArray(state))
      return this.GetSubState(state.find(s => s.Id == path[0]), path.slice(1));
    return this.GetSubState(state[path[0]], path.slice(1));
  }

  public Connect(connector: IConnector<TState, TActions>) {
    this.State$.pipe(
      takeUntil(from(connector.isDisconnected)),
    ).subscribe(state => connector.Send({state}));
    connector.Actions$.subscribe(async action => {
      const result = await this['stream'].Action({
        ...action,
        path: [...this.path, ...action.path]
      });
      connector.Send({
        requestId: action._id,
        response: result
      });
    });
  }
}
