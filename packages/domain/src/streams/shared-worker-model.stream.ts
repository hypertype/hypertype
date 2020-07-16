import {WorkerModelStream} from "./worker-model.stream";

export class SharedWorkerModelStream<TState, TActions> extends WorkerModelStream<TState, TActions> {


  protected worker : SharedWorker.SharedWorker;

  constructor(sharedWorkerPath: string) {
    super(sharedWorkerPath);
  }

  protected createWorker(path) {
    return new SharedWorker(path);
  }

  protected sendMessage(message, options) {
    this.worker.port.postMessage(message, options);
  }
}
