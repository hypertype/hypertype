import {fetchUrl} from 'fetch';
import * as WebSocket from 'ws'
import * as EventSource from 'eventsource';
import {
    ApiHttpClient,
    BaseWebSocketService,
    HttpTransportType,
    IHttpConnectionOptions,
    ITokenStore,
    WebSocketUrlInjectionToken
} from "@hypertype/infr";
import {Inject, Injectable} from "@hypertype/core";

@Injectable()
export class NodeWebSocketService extends BaseWebSocketService {
    constructor(@Inject(WebSocketUrlInjectionToken) url,
                api: ApiHttpClient,
                tokenStore: ITokenStore) {
        super(url, api, tokenStore);
    }

    protected getConfig(): IHttpConnectionOptions {
        return {
            transport: HttpTransportType.WebSockets,
            WebSocket: WebSocket,
            EventSource: EventSource
        }
    }
}
