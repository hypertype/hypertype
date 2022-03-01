import {Container} from "@hypertype/core";
import {StateLogger} from "@hypertype/infr";
import {useWorkerDomain, useDomain, IFactory} from "@cmmn/domain/proxy";
import {EMPTY_PARENT_WINDOW_STREAM_PROXY, ParentWindowStreamProxy} from './parent-window-stream.proxy';
import {ParentWindowStore} from './parent-window.store';


export const ProxyDomainContainer = {
  async withWebWorker(url: string = '/webworker.js'): Promise<Container> {
    const providers = (await useWorkerDomain(url)).getProviders();
    const container = Container.withProviders(...providers, {
    });
    return container;
  },
  withParentWindowStreamProxy(): Container {
    const container = new Container();
    const isParentWindow = !globalThis.opener;
    container.provide([
      isParentWindow
        ? {provide: ParentWindowStreamProxy, deps: []}
        : {provide: ParentWindowStreamProxy, useValue: EMPTY_PARENT_WINDOW_STREAM_PROXY}
    ]);
    container.provide([
      {provide: ParentWindowStore, deps: [ParentWindowStreamProxy]}
    ])
    return container;
  },
  // withChildWindowStream(): Container {
  //   const container = new Container();
  //   container.provide(BaseContainer);
  //   container.provide([
  //     {provide: ModelStream, useClass: DevToolModelStream, deps: [ChildWindowModelStream, StateLogger]},
  //     {provide: ChildWindowModelStream},
  //   ]);
  //   return container;
  // },
  withSimple(b): Container{
    return Container.withProviders(

    );
  }
};
