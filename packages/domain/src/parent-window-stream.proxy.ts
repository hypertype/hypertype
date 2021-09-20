import {filter, first, Fn, fromEvent, map, Observable, share, shareReplay, Subject, switchMap, tap} from '@hypertype/core';
import {IChildWindowMetadata, TChild, TChildWindowRequest} from './streams/child-window-model.stream';
import {ModelStream} from './model.stream';

interface IRemovedChild {
  id: string;
  type: TChild;
}

export class ParentWindowStreamProxy {
  private children = [];
  private removedChildSubj: Subject<IRemovedChild> = new Subject();
  private modelStreamState$: Observable<any>;

  constructor(private modelStream: ModelStream<any, any>) {
    this.modelStreamState$ = this.modelStream.State$.pipe(shareReplay(1));
    this.modelStreamState$.subscribe();

    // => из Child-окна пришло сообщение в Родительское окно. Проксирую сообщение -> в Воркер
    fromEvent<MessageEvent>(globalThis, 'message').pipe(
      filter(() => this.children.length > 0),
      filter(event => event.origin === globalThis.origin),
      map(event => event.data),
      filter(Fn.Ib),
      tap(data => this.log(`Parent.onMessage`, data)),
      switchMap(async data => { // Отработка специальных команд для Родительского окна
        const {type, childId} = data;
        switch (type as TChildWindowRequest) {
          case 'get-state':
            this.sendToChild(childId, {state: await this.lastState()});
            break;
          case 'beforeunload':
            this.removeChild(childId)
            break;
          default:
            return data;
        }
      }),
      filter(Fn.Ib),
      tap(data => this.modelStream.Action(data)),
    ).subscribe();

    // => из Воркера пришло сообщение в Родительское окно. Проксирую сообщение -> в Child-окна
    this.modelStream.Input$.pipe(
      filter(() => this.children.length > 0),
      tap(message => {
        this.log('ModelStream.Input$', message)
        this.broadcast(message);
      }),
    ).subscribe();

    // пользователь решил перезагрузить/закрыть Родительское окно =>
    // надо закрыть все Child-окна, т.к. они не могут корректно работать без Родительского окна
    fromEvent<MessageEvent>(globalThis, 'beforeunload').pipe(
      tap(() => this.broadcast({type: 'close'})),
    ).subscribe();
  }

  broadcast(message, options?): void {
    this.children.forEach(window => this.postMessage(window, message, options));
  }

  sendToChild(id: string, message, options?) {
    const window = this.childById(id);
    if (window)
      this.postMessage(window, message, options)
  }

  addChild(window: { child: IChildWindowMetadata }): boolean {
    if (this.childByObj(window) || this.childById(window.child.id))
      return false;
    this.children.push(window);
    return true;
  }

  removeChild(id: string): void {
    const removed = new Map<string, TChild>();
    this.children.removeAll(x => {
      const isExist = x.child.id === id;
      if (isExist)
        removed.set(id, x.child.type);
      return isExist;
    });
    for (const [id, type] of removed.entries())
      this.removedChildSubj.next({id, type})
  }

  removedChild$: Observable<IRemovedChild> = this.removedChildSubj.asObservable().pipe(
    share(),
  );


//region Support

  private childById(id: string) {
    return this.children.find(x => x.child.id === id);
  }

  private childByObj(obj) {
    return this.children.find(x => x === obj);
  }

  private lastState(): Promise<any> {
    return this.modelStreamState$.pipe(first()).toPromise();
  }

  private postMessage(window, message, options?): void {
    this.log('Child.postMessage', message);
    window.postMessage(message, globalThis.origin, options)
  }

  private isDebug() {
    return globalThis.isDebugParentWindow;
  }

  private log(...args) {
    if (this.isDebug())
      console.log(...args)
  }

//endregion

}
