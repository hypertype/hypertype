import {
    BaseWebSocketService,
    HttpTransportType,
    IHttpConnectionOptions,
    ApiHttpClient,
    ITokenStore,
    WebSocketUrlInjectionToken
} from "@hypertype/infr";
import {Inject, Injectable} from "@hypertype/core";

@Injectable()
export class BrowserWebSocketService extends BaseWebSocketService {

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
        };
    }

}
