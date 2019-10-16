import {Container, map, merge, Observable, ReplaySubject, shareReplay, tap} from "@hypertype/core";
import {Model} from "./model";

export class WebworkerEntry {

    private Responses$ = new ReplaySubject();

    public Output$: Observable<any> = merge(
        this.model.State$.pipe(map(d => ({state: d}))),
        this.Responses$.asObservable()
    ).pipe(
        shareReplay(1)
    );

    constructor(private model: Model<any, any>) {

    }

    static Start(self, container: Container) {

        const aggregate = container.get<Model<any, any>>(Model);

        const service = new WebworkerEntry(aggregate);
        if (self.postMessage) {
            self.addEventListener('message', service.onMessage);

            // => из Worker отправляю ответ -> в Browser Main
            service.Output$.subscribe(d => {
                try {
                    self.postMessage(d)
                }catch (e) {
                    console.error(`Failed to sent via web worker`, d);
                }
            });
        }

        // shared worker
        if ('onconnect' in self) {
            self['onconnect'] = function (e) {
                const port = e.ports[0];
                port.addEventListener('message', service.onMessage);
                service.Output$.subscribe(d => {
                    port.postMessage(d)
                });
                port.start();
            };
        }
    }

    // => из Browser Main пришла задача -> в Worker
    public onMessage = (e: MessageEvent) => {
        const request = e.data;
        this.model.Invoke(e.data)
            .then(result => this.Responses$.next({
                response: result,
                requestId: request._id
            }))
            .catch(e => this.Responses$.next({
                error: e,
                requestId: request._id
            }));
    };
}
