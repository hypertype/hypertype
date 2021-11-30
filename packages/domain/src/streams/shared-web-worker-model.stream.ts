import {fromEvent, InjectionToken, map, Observable, shareReplayRC} from "@hypertype/core";
import {WorkerModelStream} from "./worker-model.stream";
import {SharedStore} from "../shared.store";

export const UrlToken = new InjectionToken('webworker');

export class SharedWebWorkerModelStream<TState, TActions>
  extends WorkerModelStream<TState, TActions> {
  private store;

  protected Subscribe(): Observable<any> {
    return fromEvent<MessageEvent>(this.worker, 'message').pipe(
      map(e => this.store.Read(e.data)),
      shareReplayRC(1)
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
