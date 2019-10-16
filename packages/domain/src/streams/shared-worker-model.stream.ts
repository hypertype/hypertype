import {WebWorkerModelStream} from "./web-worker-model.stream";

declare var SharedWorker;

export class SharedWorkerModelStream<TState, TActions> extends WebWorkerModelStream<TState, TActions> {

    constructor(sharedWorkerPath: string) {
        super(sharedWorkerPath);
    }

    protected createWorker(path) {
        return new SharedWorker(path);
    }

}
