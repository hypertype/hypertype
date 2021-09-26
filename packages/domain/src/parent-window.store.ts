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
   * Добавляет окно в streamProxy
   * @param window
   * @param data
   * @return onRemovedFn | undefined - в случае успешного добавления окна возвращает промис,
   *                                   сигнализирующий, что открепленное окно удалено из streamProxy
   */
  addChild(window, data: IChildWindowMetadata): Promise<IChildWindowMetadata> | undefined {
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

  /**
   * Закрывает Child-окно(а) и удаляет его из streamProxy
   * @param enabledToInformAboutRemove - если true, тогда proxy отправит сообщение, когда Child-окно будет удалено
   * @param childType                  - один из типов Child-окна
   */
  closeChild(enabledToInformAboutRemove: boolean, childType?: string): void {
    if (enabledToInformAboutRemove) {
      this.streamProxy.broadcast({type: 'close', childType});
    } else {
      this.streamProxy.enabledToInformAboutRemove = false;
      this.streamProxy.broadcast({type: 'close', childType});
      setTimeout(                                                 // подождать, пока Child-окно пришлет 'disconnected'
        () => this.streamProxy.enabledToInformAboutRemove = true, // и включить обратно информирование об удалении
        500 // по-идее этого должно хватить
      );
    }
  }

}
