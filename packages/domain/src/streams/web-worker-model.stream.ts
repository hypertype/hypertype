import {fromEvent, InjectionToken, map, Observable, shareReplay} from "@hypertype/core";
import {WorkerModelStream} from "./worker-model.stream";
import {SharedStore} from "../sharedStore";

export const UrlToken = new InjectionToken('webworker');

export class WebWorkerModelStream<TState, TActions>
  extends WorkerModelStream<TState, TActions> {
  private store;

  protected Subscribe(): Observable<any> {
    return fromEvent<MessageEvent>(this.worker, 'message').pipe(
      map(e => this.store.Read(e.data)),
      shareReplay(1)
    );
  }

  protected worker: Worker;

  protected sendMessage(message, options) {
    const info = this.store.Write(message, options)
    this.worker.postMessage(info, options);
  }

  protected createWorker(path): AbstractWorker {
    const worker = new Worker(path);
    this.store = new SharedStore();
    worker.postMessage({
      input: this.store.input,
      output: this.store.output
    });
    return worker;
  }
}
