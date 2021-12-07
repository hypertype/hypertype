import {
    filter,
    map,
    NEVER,
    Observable,
    of,
    ReplaySubject,
    shareReplayRC,
    Subject,
    switchMap,
    withLatestFrom,
  distinctUntilChanged
} from "@hypertype/core";

export abstract class HyperComponent<TState = any, TEvents = any> {

    State$: Observable<TState> = of(null);
    Actions$: Observable<any> = NEVER;

    protected defaultState: TState;
    // private _attributesSubject$ = new ReplaySubject<{ name, value }>();
    private _eventsSubject$ = new Subject<{ args: any; type: keyof TEvents; }>();
    private _elementSubject$: Subject<HTMLElement> = new ReplaySubject<HTMLElement>(1);
    private _disconnect$: Subject<void> = new Subject<void>();
    protected Element$: Observable<HTMLElement> = this._elementSubject$.asObservable().pipe(
        filter(x => !!x)
    );
    protected Events$ = this._eventsSubject$.asObservable();
    // protected Attributes$: Observable<any> = this._attributesSubject$.asObservable().pipe(
    //     scan<{ name, value }, any>((acc, val) => ({...acc, [val.name]: val.value}), {}),
    //     startWith({}),
    // );
    /* @obsolete: use Size$ instead */
    protected ClientRect$: Observable<ClientRect> = this.Element$.pipe(
        switchMap(el => new Observable<ClientRect>(subscr => {
            // @ts-ignore
            const observer = new ResizeObserver(entries => {
                subscr.next(el.getBoundingClientRect())
            }) as MutationObserver;
            observer.observe(el);
            this._disconnect$.asObservable().subscribe(() => observer.disconnect());
            return () => {
                observer.disconnect();
            };
        })),
        filter(rect => rect.width > 0 && rect.height > 0),
        shareReplayRC(1)
    );

    protected Size$: Observable<{width: number; height: number;}> = this.ClientRect$.pipe(
      map(x => ({width: x.width, height: x.height}))
    );
    protected Render$ = new ReplaySubject(1);

    protected select<E extends Element = Element>(selector: string): Observable<E | null> {
        return this.Render$.asObservable().pipe(
            withLatestFrom(this.Element$),
            map(([_, element]) => element.querySelector(selector) as E),
            distinctUntilChanged(),
        );
    }

    private _injectedContent$ = new ReplaySubject<(HTMLElement|SVGElement)[]>(1);
    protected InjectedContent$ = this._injectedContent$.asObservable();

    protected Events: Partial<TEvents>;
}
