import {filter, first, Fn, fromEvent, map, Observable, share, shareReplay, Subject, switchMap, tap} from '@hypertype/core';
import {IChildWindowMetadata, TChildWindowRequest} from './contract';
import {ModelStream} from './model.stream';

export const EMPTY_PARENT_WINDOW_STREAM_PROXY = 'empty' as any;

export class ParentWindowStreamProxy {
  private children = [];
  private removedChildSubj: Subject<IChildWindowMetadata> = new Subject();
  private modelStreamState$: Observable<any>;
  public enabledToInformAboutRemove = true;

  constructor(private modelStream: ModelStream<any, any>) {
    this.modelStreamState$ = this.modelStream.State$.pipe(shareReplay(1));
    this.modelStreamState$.subscribe();

    // => из Child-окна пришло сообщение в Родительское окно. Проксировать сообщение -> в Воркер
    fromEvent<MessageEvent>(globalThis, 'message').pipe(
      filter(() => this.children.length > 0),
      filter(event => event.origin === globalThis.origin),
      map(event => event.data),
      filter(Fn.Ib),
      tap(data => log(`Parent.onMessage`, data)),
      switchMap(async data => { // Отработка специальных команд для Родительского окна
        const {type, childId} = data;
        switch (type as TChildWindowRequest) {
          case 'connected':
            this.sendToChild(childId, {state: await this.lastState()});
            break;
          case 'disconnected':
            this.removeChild(childId)
            break;
          default:
            return data;
        }
      }),
      filter(Fn.Ib),
      tap(data => this.modelStream.Action(data)),
    ).subscribe();

    // => из Воркера пришло сообщение в Родительское окно. Проксировать сообщение -> в Child-окна
    this.modelStream.Input$.pipe(
      filter(() => this.children.length > 0),
      tap(message => {
        log('ModelStream.Input$', message)
        this.broadcast(message);
      }),
    ).subscribe();

    // пользователь решил перезагрузить/закрыть Родительское окно =>
    // надо закрыть все Child-окна, т.к. они не могут корректно работать без Родительского окна.
    fromEvent<MessageEvent>(globalThis, 'beforeunload').pipe(
      tap(() => {
        this.enabledToInformAboutRemove = false; // т.к. TDetachState должен обрабатываться в пользовательском коде
        this.closeChildren();
      }),
    ).subscribe();
  }

  broadcast(message, options?): void {
    this.children.forEach(window => postMessage(window, message, options));
  }

  sendToChild(childId: string, message, options?) {
    const window = this.childById(childId);
    if (window)
      postMessage(window, message, options);
    else
      console.error(`window "${childId}" not found on send to child`);
  }

  addChild(window: { child: IChildWindowMetadata }): boolean {
    if (this.childByObj(window) || this.childById(window.child.childId)) {
      console.error('window already exists in stream proxy');
      return false;
    }
    this.children.push(window);
    return true;
  }

  removeChild(childId: string): void {
    let removed: IChildWindowMetadata[] = [];
    this.children.removeAll(x => {
      const isExist = x.child.childId === childId;
      if (isExist)
        removed.push(x.child);
      return isExist;
    });
    if (removed.length === 0) {
      console.error(`window "${childId}" not found on remove`);
      return;
    }
    if (removed.length > 1)
      console.error(`window "${childId}" duplicated ${removed.length} times`);
    this.removedChildSubj.next(removed[0]);
  }

  removedChild$: Observable<IChildWindowMetadata> = this.removedChildSubj.asObservable().pipe(
    filter(() => this.enabledToInformAboutRemove),
    share(),
  );

  closeChildren(metadata: Partial<IChildWindowMetadata> = {}): void {
    this.broadcast({type: 'close', ...metadata});
  }


//region Support

  private childById(childId: string) {
    return this.children.find(x => x.child.childId === childId);
  }

  private childByObj(obj) {
    return this.children.find(x => x === obj);
  }

  private lastState(): Promise<any> {
    return this.modelStreamState$.pipe(first()).toPromise();
  }

//endregion

}

function postMessage(window, message, options?): void {
  log('Child.postMessage', message);
  window.postMessage(message, globalThis.origin, options);
}

function log(...args) {
  if (globalThis.isDebugParentWindow === true)
    console.log(...args)
}
