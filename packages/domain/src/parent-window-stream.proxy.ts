import {filter, Fn, fromEvent, map, share, Subject, tap} from '@hypertype/core';
import {ModelStream} from './model.stream';

export class ParentWindowStreamProxy {
  private children = [];
  private removerSubj = new Subject<string>();

  constructor(private modelStream: ModelStream<any, any>) {

    // => из Child-окна пришло сообщение в Родительское окно. Проксирую сообщение -> в Воркер
    fromEvent<MessageEvent>(globalThis, 'message').pipe(
      filter(() => this.children.length > 0),
      filter(event => event.origin === globalThis.origin),
      map(event => event.data),
      filter(Fn.Ib),
      map(data => { // Отработка специальных команд для Родительского окна
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
      tap(data => this.modelStream.Action(data)),
    ).subscribe();

    // => из Воркера пришло сообщение в Родительское окно. Проксирую сообщение -> в Child-окна
    this.modelStream.Input$.pipe(
      filter(() => this.children.length > 0),
      tap(message => {
        console.log(`workerModelStream.Input$`, message)
        this.broadcast(message);
      }),
    ).subscribe();

    fromEvent<MessageEvent>(globalThis, 'beforeunload').pipe(
      tap(() => this.broadcast({type: 'close'})),
    ).subscribe();
  }

  broadcast(message, options?): void {
    this.children.forEach(child => postMessage(child, message, options));
  }

  addChild(window): boolean {
    if (this.children.find(x => (
      x === window ||
      x.child.id === window.child.id))
    )
      return false;
    this.children.push(window);
    return true;
  }

  removeChild(id: string): void {
    const removedIds = [];
    this.children.removeAll(x => {
      const isExist = x.child.id === id;
      if (isExist)
        removedIds.push(id);
      return isExist;
    });
    removedIds.forEach(x => this.removerSubj.next(x));
  }

  removed$ = this.removerSubj.asObservable().pipe(
    share(),
  );

}

function postMessage(child, message, options?): void {
  child.postMessage(message, globalThis.origin, options)
}
