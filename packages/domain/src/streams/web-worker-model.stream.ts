import {InjectionToken} from "@hypertype/core";
import {WorkerModelStream} from "./worker-model.stream";

export const UrlToken = new InjectionToken('webworker');

export class WebWorkerModelStream<TState, TActions>
  extends WorkerModelStream<TState, TActions> {

  protected worker: Worker;

  protected sendMessage(message, options) {
    this.worker.postMessage(message, options);
  }

  protected createWorker(path): AbstractWorker {
    return new Worker(path);
  }
}
