import {InjectionToken, Observable} from "@hypertype/core";
import {WorkerModelStream} from "./worker-model.stream";
import {fromEvent, map, shareReplay} from "@hypertype/core";

export const UrlToken = new InjectionToken('webworker');

export class SimpleWebWorkerModelStream<TState, TActions>
  extends WorkerModelStream<TState, TActions> {
  protected Subscribe(): Observable<any> {
    return fromEvent<MessageEvent>(this.worker, 'message').pipe(
      map(e => e.data),
      shareReplay(1)
    );
  }

  protected worker: Worker;

  public sendMessage(message, options) {
    this.worker.postMessage(message, options);
  }

  protected createWorker(path): AbstractWorker {
    return new Worker(path);
  }
}
