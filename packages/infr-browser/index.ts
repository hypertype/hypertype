import {Container} from "@hypertype/core";
import {InfrContainer, IRequestService, IWebSocketService, StateLogger} from "@hypertype/infr";
import {FetchRequestService} from "./fetchRequestService";
import {BrowserWebSocketService} from "./browser.web-socket.service";
import {DevToolsStateLogger} from "./dev-tools.state-logger";

export const BrowserContainer = new Container();
BrowserContainer.provide(InfrContainer);
BrowserContainer.provide([
    {provide: StateLogger, useClass: DevToolsStateLogger},
    {provide: IRequestService, useClass: FetchRequestService},
    {provide: IWebSocketService, useClass: BrowserWebSocketService},
]);

export {
    FetchRequestService,
    DevToolsStateLogger
}
