import {
  from, fromEvent,
  map, Observable,
  shareReplayRC,
  Subject,
  takeUntil,
  tap
} from "@hypertype/core";
import {ModelPath, ModelProxy as CmmnModelProxy, Action, Stream} from "@cmmn/domain/proxy";
import {IConnector} from "./child-window.connector";
import {ModelAction} from "@cmmn/domain/worker";

export class ModelProxy<TState, TActions extends ModelAction> extends CmmnModelProxy<TState, TActions> {

  public State$: Observable<TState> = fromEvent<any>(this.$state, "change").pipe(
    map(event => event.data.value),
    shareReplayRC(1),
  )

  constructor(stream: Stream, path: ModelPath = []) {
    super(stream, path);
  }

  protected GetSubProxy<UState, UActions extends ModelAction>(constructor: any = ModelProxy, path: keyof TState, ...paths: any[]): ModelProxy<UState, UActions> {
    return new constructor(this.stream, [...this.path, path, ...paths]);
  }

  public Connect(connector: IConnector<TState, TActions>) {
    this.State$.pipe(
      takeUntil(from(connector.isDisconnected)),
    ).subscribe(state => connector.Send({state}));
    connector.Actions$.subscribe(async action => {
      const result = await this.stream.Invoke({
        action: action.action,
        args: action.args,
        path: [...this.path, ...action.path]
      });
      connector.Send({
        requestId: action.actionId,
        response: result
      });
    });
  }
}
