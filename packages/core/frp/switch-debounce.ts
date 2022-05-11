import {async, debounceTime, first, of, share, Subject, switchMap} from './operators';

function switchDebounce(time: number) {
  return (target, key, descriptor) => {
    const requestSymbol = Symbol('request');
    const responseSymbol = Symbol('response');
    const fn = descriptor.value;
    if (typeof fn !== 'function')
      throw new Error('Decorator "switchDebounce" is only available for functions');
    descriptor.value = function (...args) {
      const requests$: Subject<Function> = this[requestSymbol] = (this[requestSymbol] || new Subject<Function>());
      const response$ = this[responseSymbol] = (this[responseSymbol] || requests$.pipe(
        debounceTime(time, async),
        switchMap(fn => {
          const result = fn();
          if (typeof result === 'object' && result !== null
            && result.then)
            return result as Promise<any>;
          return of(result);
        }),
        share(),
      ));
      const valuePromise = response$.pipe(first()).toPromise();
      requests$.next(() => fn.apply(this, args));
      return valuePromise;
    }
    return descriptor;
  }
}

