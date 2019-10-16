import {UrlToken, WebWorkerModelStream} from "./streams/web-worker-model.stream";
import {ModelStream} from "./model.stream";
import {Container} from "@hypertype/core";
import {SharedWorkerModelStream} from "./streams/shared-worker-model.stream";
import {SimpleModelStream} from "./streams/simple-model.stream";
import {WebSocketModelStream} from "./streams/web-socket-model.stream";
import {ModelProxy} from "./model.proxy";
import {Model} from "./model";
import {DevToolModelStream} from "./streams/dev-tool-model.stream";
import {WebsocketEntry} from "./websocket.entry";
import {StateLogger} from "@hypertype/infr";


const BaseContainer = new Container();
BaseContainer.provide([
    {provide: ModelProxy, deps: [ModelStream]},
    {provide: WebsocketEntry, deps: [Model]},
]);

function getStreamProviders(devTools = false) {
    if (devTools) {
        return
    }
}

export const ProxyDomainContainer = {
    withSharedWorker(url: string = '/webworker.js', devTools = false): Container {
        const container = new Container();
        container.provide(BaseContainer);
        if (devTools) {
            container.provide([
                {provide: ModelStream, useClass: DevToolModelStream, deps: [SharedWorkerModelStream, StateLogger]},
                {provide: SharedWorkerModelStream, deps: [UrlToken]},
                {provide: UrlToken, useValue: url},
            ]);
        } else {
            container.provide([
                {provide: ModelStream, useClass: SharedWorkerModelStream, deps: [UrlToken]},
                {provide: UrlToken, useValue: url},
            ]);
        }
        return container;
    },
    withWebWorker(url: string = '/webworker.js', devTools = false): Container {
        const container = new Container();
        container.provide(BaseContainer);
        if (devTools) {
            container.provide([
                {provide: ModelStream, useClass: DevToolModelStream, deps: [WebWorkerModelStream, StateLogger]},
                {provide: WebWorkerModelStream, deps: [UrlToken]},
                {provide: UrlToken, useValue: url},
            ]);
        } else {
            container.provide([
                {provide: ModelStream, useClass: WebWorkerModelStream, deps: [UrlToken]},
                {provide: UrlToken, useValue: url},
            ]);
        }
        return container;
    },
    withSimple(devTools = false): Container {
        const container = new Container();
        container.provide(BaseContainer);
        if (devTools) {
            container.provide([
                {provide: ModelStream, useClass: DevToolModelStream, deps: [SimpleModelStream, StateLogger]},
                {provide: SimpleModelStream, deps: [Model]},
            ]);
        } else {
            container.provide([
                {provide: ModelStream, useClass: SimpleModelStream, deps: [Model]},
            ]);
        }
        return container;
    },
    withWebSocket(url: string = '/domain/websocket', devTools = false): Container {
        const container = new Container();
        container.provide(BaseContainer);
        if (devTools) {
            container.provide([
                {provide: ModelStream, useClass: DevToolModelStream, deps: [WebSocketModelStream, StateLogger]},
                {provide: WebSocketModelStream, deps: [UrlToken]},
                {provide: UrlToken, useValue: url},
            ]);
        } else {
            container.provide([
                {provide: ModelStream, useClass: WebSocketModelStream, deps: [UrlToken]},
                {provide: UrlToken, useValue: url},
            ]);
        }
        return container;
    }
};
