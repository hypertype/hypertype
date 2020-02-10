import {InjectionToken, Observable} from "@hypertype/core";

export abstract class IWebSocketService {
    public abstract Hub(hub: string): {
        messages$: Observable<any>
    };

    public abstract send<T>(method: string, ...params): Promise<T>;
}
export const WebSocketUrlInjectionToken = new InjectionToken('WebSocketUrlInjectionToken');
