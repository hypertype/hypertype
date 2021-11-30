import {Container, map, merge, Observable, Subject, shareReplayRC} from "@hypertype/core";
import {fromEvent, takeUntil} from "@hypertype/core";
import {getTransferable} from './transferable';
import {Model} from "./model";

export class SimpleWebWorkerEntry {

    private Responses$ = new Subject();

    public Output$: Observable<any> = merge(
        this.model.State$.pipe(map(d => ({state: d}))),
        this.Responses$.asObservable()
    ).pipe(
        shareReplayRC(1)
    );

    constructor(private model: Model<any, any>) {

    }

    static Start(self, container: Container) {

        const aggregate = container.get<Model<any, any>>(Model);

        const service = new SimpleWebWorkerEntry(aggregate);
        if (self.postMessage) {
            self.addEventListener('message', service.onMessage);

            // => из Worker отправляю ответ -> в Browser Main
            service.Output$.subscribe(d => {
                try {
                    self.postMessage(d, getTransferable(d))
                } catch (e) {
                    console.error(`Failed to sent via web worker [structured-clone]`, d, e);
                }
            });
        }

        // shared worker
        if ('onconnect' in self) {
            self['onconnect'] = function (e) {
                const port = e.ports[0];
                port.addEventListener('message', service.onMessage);
                service.Output$.pipe(
                  takeUntil(fromEvent(self, 'disconnect'))
                ).subscribe(d => {
                  try {
                      port.postMessage(d, getTransferable(d));
                  } catch (e) {
                      console.error(`Failed to sent via shared worker [structured-clone]`, d, e);
                  }
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
