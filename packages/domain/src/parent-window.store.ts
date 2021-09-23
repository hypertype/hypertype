import {filter, first} from '@hypertype/core';
import {EMPTY_PARENT_WINDOW_STREAM_PROXY, ParentWindowStreamProxy} from './parent-window-stream.proxy';
import {IChildWindowMetadata} from './contract';

/**
 * Обертка над ParentWindowStreamProxy
 */
export class ParentWindowStore {

  constructor(private streamProxy: ParentWindowStreamProxy) {
  }

  get isReady(): boolean {
    return this.streamProxy !== EMPTY_PARENT_WINDOW_STREAM_PROXY;
  }

  /**
   *
   * @param window
   * @param data
   * @return onAttachFn | undefined - в случае успешного добавления окна возвращает промис,
   *                                  сигнализирующий, что открепленное окно прикрепленно обратно
   */
  addChild(window, data: IChildWindowMetadata): Promise<any> | undefined {
    if (!this.isReady)
      return;
    window['child'] = data;
    if (!this.streamProxy.addChild(window as any))
      return;
    return this.streamProxy.removedChild$.pipe(
      filter(x => x.id === data.id),
      first(),
    ).toPromise();
  }

}
