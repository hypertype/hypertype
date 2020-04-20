import { ApiHttpClient, BaseWebSocketService, IHttpConnectionOptions, ITokenStore } from "@hypertype/infr";
export declare class NodeWebSocketService extends BaseWebSocketService {
    constructor(url: any, api: ApiHttpClient, tokenStore: ITokenStore);
    protected getConfig(): IHttpConnectionOptions;
}
//# sourceMappingURL=node.web-socket.service.d.ts.map