import {filter, first, Fn, Observable, ReplaySubject, shareReplay} from "@hypertype/core";
import {IWebSocketService} from "./i-web-socket.service";
import {HubConnection} from "./signalr/HubConnection";
import {IHttpConnectionOptions} from "./signalr";
import {LogLevel} from "./signalr/contracts/ILogger";
import {HubConnectionBuilder} from "./signalr/HubConnectionBuilder";
import {ApiHttpClient} from "./api-http.client";
import {ITokenStore} from "./auth-api.service";


export abstract class BaseWebSocketService extends IWebSocketService {
    private connectionSubject$ = new ReplaySubject<HubConnection>(1);
    private connection$: Observable<HubConnection> = this.connectionSubject$.asObservable().pipe(
        filter(Fn.Ib),
    );

    protected constructor(private url: string = "http://localhost:8888/inventory",
                          private api: ApiHttpClient,
                          private tokenStore: ITokenStore
    ) {
        super();
    }

    private isInit = false;

    public Hub(hub: string) {
        if (!this.isInit)
            this.initConnection();
        return new WebSocketHub(this.connection$, hub);
    }

    public send<T>(method: string, ...params): Promise<T> {
        return this.connection$.pipe(
            first(),
        ).toPromise()
            .then(connection => connection.start().then(() => {
                return connection.invoke<T>(method, ...params);
            }));
    }

    protected abstract getConfig(): IHttpConnectionOptions;

    private initConnection(tryCounter = 0) {
        const config = {
            ...this.getConfig(),
            httpClient: this.api,
            accessTokenFactory: () => {
                return this.tokenStore.get();
            }
        };
        const connection = new HubConnectionBuilder()
            .withUrl(this.url, config)
            .configureLogging({
                log: (type: LogLevel, message) => {
                    if (type >= LogLevel.Error) {
                        connection.stop().catch();
                        // this.restartConnection(connection);
                    }
                }
            })
            .build();
        connection.start().catch(e => {
            this.restartConnection(tryCounter + 1);
        });
        connection.onclose(e => {
            this.restartConnection();
        });
        this.connectionSubject$.next(connection);
        this.isInit = true;
    }

    private restartConnection(tryCounter = 1) {
        this.connectionSubject$.next(null);
        console.warn('disconnected, try: ', tryCounter);
        setTimeout(() => {
            //   this.initConnection(tryCounter);
        }, tryCounter * 1000);
    }

}

export class WebSocketHub {
    private messagesSubject = new ReplaySubject();
    public messages$: Observable<any> = this.messagesSubject.asObservable().pipe(
        shareReplay(1)
    );

    constructor(private connection: Observable<HubConnection>, hub: string) {
        this.connection.subscribe(connection =>
            connection.on(hub, (...params) => {
                this.messagesSubject.next(params);
            })
        );
    }
}
