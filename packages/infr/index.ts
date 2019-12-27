import {Logger} from "./src/logger";
import {ApiService, ApiUrlInjectionToken} from "./src/api.service";
import {IRequestService} from "./src/request.service";
import {Container} from "@hypertype/core";
import {WebSocketUrlInjectionToken} from "./src/i-web-socket.service";
import {AuthApiService, ITokenStore} from "./src/auth-api.service";
import {ApiHttpClient} from "./src/api-http.client";

export {BaseWebSocketService} from "./src/base-web-socket.service";

export * from './src/logger';
export * from './src/api.service';
export * from './src/request.service';
export * from './src/i-web-socket.service';
export * from './src/state.logger';

export const InfrContainer = new Container();
InfrContainer.provide([
    ApiHttpClient,
    {provide: Logger},
    {
        provide: ITokenStore, useValue: {
            get() {
                return null;
            }, set() {
            }
        }
    },
    {provide: ApiService, deps: [IRequestService, ApiUrlInjectionToken]},
    {provide: ApiUrlInjectionToken, useValue: 'http://localhost/api'},
    {provide: WebSocketUrlInjectionToken, useValue: 'http://localhost/inventory'},
]);

export const AuthContainer = new Container();
AuthContainer.provide(InfrContainer);
AuthContainer.provide([
    {provide: ApiService, useClass: AuthApiService, deps: [IRequestService, ApiUrlInjectionToken, ITokenStore]}
]);

export * from './signalr';
export {
    ITokenStore, WebSocketUrlInjectionToken, ApiHttpClient
}
