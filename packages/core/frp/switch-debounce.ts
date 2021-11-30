import {async, debounceTime, first, ReplaySubject, switchMap} from "./operators";
import {shareReplayRC} from './share-replay-rc';

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
                    shareReplayRC(1)
                );
                requests$.next(() => fn.apply(this, args));
                return response$.pipe(first()).toPromise();
            }
        })
    }
}
