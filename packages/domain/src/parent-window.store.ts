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
   * Добавляет окно в streamProxy.
   * @param window
   * @param metadata
   * @return onRemovedFn | undefined - в случае успешного добавления окна возвращает промис,
   *                                   сигнализирующий, что открепленное окно удалено из streamProxy.
   */
  addChild(window, metadata: IChildWindowMetadata): Promise<IChildWindowMetadata> | undefined {
    if (!this.isReady)
      return;
    if (!this.streamProxy.addChild(window, {...metadata}))
      return;
    window['child'] = {...metadata};
    const {childId} = metadata;
    return this.streamProxy.removedChild$.pipe(
      filter(x => x.childId === childId),
      first(),
    ).toPromise();
  }

  /**
   * Закрывает Child-окно(а) и удаляет его из streamProxy.
   * @param informAboutRemove - если true, тогда proxy отправит сообщение, когда Child-окно будет удалено;
   * @param metadata          - информация об удалямом окне(ах).
   * @param timeout           - если informAboutRemove === false, тогда proxy сможет информировать о следующем удаленном Child-окне через указанный timeout.
   */
  closeChildren(informAboutRemove: boolean, metadata?: Partial<IChildWindowMetadata>, timeout = 500): void {
    if (!this.isReady)
      return;
    if (informAboutRemove)
      this.streamProxy.closeChildren(metadata);
    else {
      this.streamProxy.enabledToInformAboutRemove = false;
      this.streamProxy.closeChildren(metadata);
      setTimeout(() => this.streamProxy.enabledToInformAboutRemove = true, timeout);
    }
  }

}
