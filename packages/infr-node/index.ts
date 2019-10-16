import {Container} from "@hypertype/core";
import {InfrContainer, IRequestService, IWebSocketService} from "@hypertype/infr";
import {NodeFetchService} from "./nodeFetchService";
import {NodeWebSocketService} from "./node.web-socket.service";

export const NodeContainer = new Container();
NodeContainer.provide(InfrContainer);
NodeContainer.provide([
    {provide: IRequestService, useClass: NodeFetchService},
    {provide: IWebSocketService, useClass: NodeWebSocketService}
]);
