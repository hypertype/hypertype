import {WorkerModelStream} from "./worker-model.stream";
import {fromEvent, map, Observable, shareReplay} from "@hypertype/core";

export class SharedWorkerModelStream<TState, TActions>
  extends WorkerModelStream<TState, TActions> {


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

  protected Subscribe(): Observable<any> {
    return fromEvent<MessageEvent>(this.worker.port, 'message').pipe(
      map(e => e.data),
      shareReplay(1)
    );;
  }
}
