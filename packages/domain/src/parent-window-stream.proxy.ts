import {filter, first, Fn, fromEvent, map, Observable, share, shareReplay, Subject, switchMap, tap} from '@hypertype/core';
import {IChildWindowMetadata, TChildWindowRequest} from './streams/child-window-model.stream';
import {ModelStream} from './model.stream';

export class ParentWindowStreamProxy {
  private children = [];
  private removedChildIdSubj = new Subject<string>();
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
    const removedIds = [];
    this.children.removeAll(x => {
      const isExist = x.child.id === id;
      if (isExist)
        removedIds.push(id);
      return isExist;
    });
    removedIds.forEach(x => this.removedChildIdSubj.next(x));
  }

  removedChildId$ = this.removedChildIdSubj.asObservable().pipe(
    share(),
  );


//region Support

  childById(id: string) {
    return this.children.find(x => x.child.id === id);
  }

  childByObj(obj) {
    return this.children.find(x => x === obj);
  }

  lastState(): Promise<any> {
    return this.modelStreamState$.pipe(first()).toPromise();
  }

  postMessage(window, message, options?): void {
    this.log(`Child.postMessage`, message);
    window.postMessage(message, globalThis.origin, options)
  }

  isDebug() {
    return globalThis.isDebugParentWindow;
  }

  log(...args) {
    if (this.isDebug())
      console.log(...args)
  }

//endregion

}
