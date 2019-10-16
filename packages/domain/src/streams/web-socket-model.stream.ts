import {fromEvent, map, Observable} from "@hypertype/core";
import {IAction, IInvoker, ModelStream} from "../model.stream";

export class WebSocketModelStream<TState, TActions> extends ModelStream<TState, TActions> {
    public State$: Observable<TState>;
    private ws: WebSocket;

    constructor(webSocketPath: string) {
        super();
        this.ws = new WebSocket(webSocketPath);
        this.ws.binaryType = 'arraybuffer';
        this.State$ = fromEvent<MessageEvent>(this.ws, 'message').pipe(
            // tap(console.log),
            map(e => e.data),
            map(s => JSON.parse(s) as TState),
        );
    }

    public Action: IInvoker<TActions> = (action: IAction<TActions>) => {
        this.ws.send(JSON.stringify(action));
    };

}
