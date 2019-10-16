import {Logger} from "./logger";
import {ApiService, ApiUrlInjectionToken} from "./api.service";
import {IRequestService} from "./request.service";
import {Container} from "@hypertype/core";
import {WebSocketUrlInjectionToken} from "./i-web-socket.service";
import {AuthApiService, ITokenStore} from "./auth-api.service";
import {ApiHttpClient} from "./api-http.client";

export {BaseWebSocketService} from "./base-web-socket.service";

export * from './logger';
export * from './api.service';
export * from './request.service';
export * from './i-web-socket.service';
export * from './state.logger';

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
