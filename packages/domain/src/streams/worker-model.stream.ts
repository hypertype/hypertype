import {filter, first, Fn, map, mergeMap, Observable, of, throwError} from "@hypertype/core";
import {getMessageId, IAction, IInvoker, ModelStream} from "../model.stream";
import {getTransferable} from '../transferable';

export abstract class WorkerModelStream<TState, TActions> extends ModelStream<TState, TActions> {
    public Input$: Observable<any>;
    public State$: Observable<TState>;
    protected worker: AbstractWorker;

    constructor(webSocketPath: string) {
        super();
        this.worker = this.createWorker(webSocketPath);

        // => из Worker пришло сообщение -> в Browser Main
        this.Input$ = this.Subscribe();

        this.State$ = this.Input$.pipe(
            map(d => d.state),
            filter(Fn.Ib),
        );
        this.State$.subscribe();
    }

  protected abstract Subscribe(): Observable<any>;
  protected abstract createWorker(path): AbstractWorker;

    protected abstract sendMessage(message, options);

    // => из Browser Main отправляю сообщение -> в Worker
    public Action: IInvoker<TActions> = (action: IAction<TActions>) => {
        const id = action._id || getMessageId(action);
        this.sendMessage({
            ...action,
            _id: id
          }, getTransferable(action.args));
        return this.Input$.pipe(
            filter(d => d.requestId == id),
            mergeMap(d => d.error ? throwError(d.error) : of(d.response)),
            first()
        ).toPromise()
    };


}
