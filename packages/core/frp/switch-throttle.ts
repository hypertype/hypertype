import {
    async,
    debounceTime,
    first,
    mergeMap,
    of,
    ReplaySubject,
    shareReplay,
    startWith,
    switchMap,
    throttleTime
} from "./operators";

export function switchThrottle(time: number) {
    return (target, key, decorator) => {
        const requestSymbol = Symbol('request');
        const responseSymbol = Symbol('response');
        const fn = target[key];
        decorator.value = function (...args) {
            const requests$: ReplaySubject<Function> = this[requestSymbol] = this[requestSymbol]
                || new ReplaySubject<Function>(0);
            const response$ = this[responseSymbol] = this[responseSymbol] || requests$.pipe(
                startWith((() => of(null)) as Function),
                mergeMap(a => [a, a]),
                throttleTime(time, async, {leading: true, trailing: true}),
                switchMap(fn => fn()),
                shareReplay(1)
            ).subscribe();
            return new Promise(resolve => {
                requests$.next(() => fn.apply(this, args).then(resolve));
            })
        }
        // Object.defineProperty(target, key, {
        //     value(...args) {
        //     }
        // })
    }
}

export function switchDebounce(time: number) {
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
