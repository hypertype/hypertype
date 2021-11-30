import {WorkerModelStream} from "./worker-model.stream";
import {fromEvent, map, Observable, shareReplayRC} from "@hypertype/core";

export class SharedWorkerModelStream<TState, TActions>
  extends WorkerModelStream<TState, TActions> {


  // @ts-ignore
  protected worker : SharedWorker;

  constructor(sharedWorkerPath: string) {
    super(sharedWorkerPath);
    this.worker.port.start();
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
      shareReplayRC(1)
    );
  }
}
