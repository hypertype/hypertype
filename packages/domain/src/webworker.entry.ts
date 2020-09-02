import {
  Container,
  filter,
  fromEvent,
  map,
  merge,
  Observable,
  ReplaySubject,
  shareReplay,
  takeUntil
} from "@hypertype/core";
import {Model} from "./model";
import {SharedStore} from "./sharedStore";

export class WebworkerEntry {

  private Responses$ = new ReplaySubject();
  private store: SharedStore;

  public Output$: Observable<any> = merge(
    this.model.State$.pipe(map(d => ({state: d}))),
    this.Responses$.asObservable()
  ).pipe(
    filter(x => this.store != null),
    map(data => this.store.Write(data)),
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
        } catch (e) {
          console.error(`Failed to sent via web worker`, d);
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
          port.postMessage(d)
        });
        port.start();
      };
    }
  }

  // => из Browser Main пришла задача -> в Worker

  public onMessage = (e: MessageEvent) => {
    if (e.data?.input instanceof SharedArrayBuffer) {
      this.store = new SharedStore(e.data.output, e.data.input);
      console.log('store', this, this.store);
      return;
    }
    const request = this.store.Read(e.data);
    this.model.Invoke(request)
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
