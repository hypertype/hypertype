import {IAction, IInvoker, ModelStream} from "../model.stream";
import {
    filter,
    first,
    Fn,
    fromEvent,
    InjectionToken,
    map,
    mergeMap,
    Observable,
    of, shareReplay,
    tap,
    throwError
} from "@hypertype/core";

declare const OffscreenCanvas;
export const UrlToken = new InjectionToken('webworker');

export class WebWorkerModelStream<TState, TActions> extends ModelStream<TState, TActions> {
    public Input$: Observable<any>;
    public State$: Observable<TState>;
    private worker: Worker;

    constructor(webSocketPath: string) {
        super();
        this.worker = this.createWorker(webSocketPath);

        // => из Worker пришел ответ -> в Browser Main
        this.Input$ = fromEvent<MessageEvent>(this.worker, 'message').pipe(
            map(e => e.data),
            shareReplay(1)
        );

        this.State$ = this.Input$.pipe(
            map(d => d.state),
            filter(Fn.Ib),
        );
        this.State$.subscribe();
    }

    protected createWorker(path) {
        return new Worker(path);
    }

    // => из Browser Main отправляю задание -> в Worker
    public Action: IInvoker<TActions> = (action: IAction<TActions>) => {
        const id = +performance.now();
        this.worker.postMessage({
            ...action,
            _id: id
        }, ('OffscreenCanvas' in window) ? action.args.filter(a => {
            return (a instanceof OffscreenCanvas);
        }) : []);
        return this.Input$.pipe(
            filter(d => d.requestId == id),
            mergeMap(d => d.error ? throwError(d.error) : of(d.response)),
            first()
        ).toPromise()
    };

}


