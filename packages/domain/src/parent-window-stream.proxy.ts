import {filter, Fn, fromEvent, map, tap} from '@hypertype/core';
import {SimpleWebWorkerModelStream} from './streams/simple-web-worker-model.stream';

declare const OffscreenCanvas;

export class ParentWindowStreamProxy {
  private children = [];

  constructor(private workerModelStream: SimpleWebWorkerModelStream<any, any>) {
    const hasOffscreenCanvas = 'OffscreenCanvas' in globalThis;

    // => из Child-окна пришло сообщение в Родительское окно. Проксирую сообщение -> в Воркер
    fromEvent<MessageEvent>(globalThis, 'message').pipe(
      filter(() => this.children.length > 0),
      filter(event => event.origin === globalThis.origin),
      map(event => event.data),
      filter(Fn.Ib),
      map(data => {
        switch (data.type) {
          case 'beforeunload':
            this.removeChild(data.childWindowId)
            break;
          default:
            return data;
        }
      }),
      filter(Fn.Ib),
      tap(data => console.log(`ParentWindowStreamProxy.onMessage`, data)),
      tap(data => this.workerModelStream.sendMessage(
        data,
        hasOffscreenCanvas
          ? data.args.filter(a => (a instanceof OffscreenCanvas))
          : []
      )),
    ).subscribe();

    // => из Воркера пришло сообщение в Родительское окно. Проксирую сообщение -> в Child-окна
    this.workerModelStream.Input$.pipe(
      filter(() => this.children.length > 0),
      tap(message => {
        console.log(`workerModelStream.Input$`, message)
        this.children.forEach(child => postMessage(child, message));
      }),
    ).subscribe();
  }

  setChild(childWindow): void {
    if (this.children.find(x => (
      x === childWindow ||
      x.child.id === childWindow.child.id))
    )
      return;
    this.children.push(childWindow);
  }

  removeChild(id: string): void {
    this.children.removeAll(x => x.child.id === id);
  }

}

function postMessage(child, message, options?): void {
  child.postMessage(message, globalThis.origin, options)
}
