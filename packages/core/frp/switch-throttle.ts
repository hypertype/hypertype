import {async, asyncScheduler, first, Observable, shareReplay, Subject, switchMap, throttleTime,} from "./operators";

export function switchThrottle(time: number, settings = {leading: true, trailing: true}) {
  const requestMap = new Map<any, {
    requests: Subject<any[]>,
    results: Observable<any>
  }>();

  return (target, key, decorator) => {

    const fn = target[key];
    const get = self => {
      if (!requestMap.has(self)) {
        const requests = new Subject<any[]>();
        const results = requests.asObservable().pipe(
          // tap(x => console.log('call', x)),
          throttleTime(time, asyncScheduler, settings),
          // tap(x => console.log('throttle', x)),

          switchMap(async (args) => {
            await fn.apply(self, args);
          }),

          shareReplay({
            windowTime: 0,
            refCount: true,
            scheduler: async,
            bufferSize: 0
          })
        );
        results.subscribe();
        requestMap.set(self, {
          requests, results
        });
      }
      return requestMap.get(self);
    }

    decorator.value = function (...args) {
      const {requests, results} = get(this);
      requests.next(args);
      return results.pipe(
        first(),
      ).toPromise();
    }
    // Object.defineProperty(target, key, {
    //     value(...args) {
    //     }
    // })
  }
}


/*
export function serializeAndDebounce() {
    return (target, key, decorator) => {
        const requestSymbol = Symbol('request');
        const responseSymbol = Symbol('response');
        const fn = target[key];
        Object.defineProperty(target, key, {
            value(...args) {
                const requests$: ReplaySubject<Function> = this[requestSymbol] = this[requestSymbol]
                    || new ReplaySubject<Function>(0);
                const response$ = this[responseSymbol] = this[responseSymbol] || requests$.pipe(
                    debounceTime(time, async),
                    switchMap(fn => fn()),
                    shareReplay(1)
                );
                requests$.next(() => fn.apply(this, args));
                return response$.pipe(first()).toPromise();
            }
        })
    }
}*/
