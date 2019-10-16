import {
    filter,
    first,
    map,
    NEVER,
    Observable,
    of,
    ReplaySubject,
    scan,
    shareReplay,
    startWith,
    Subject,
    switchMap,
    withLatestFrom
} from "@hypertype/core";

export abstract class HyperComponent<TState = any, TEvents = any> {

    State$: Observable<TState> = of(null);
    Actions$: Observable<{ type: string; payload?: any }> = NEVER;

    protected defaultState: TState;
    private _attributesSubject$ = new ReplaySubject<{ name, value }>();
    private _eventsSubject$ = new ReplaySubject<{ args: any; type: keyof TEvents; }>();
    private _elementSubject$: Subject<HTMLElement> = new ReplaySubject<HTMLElement>();
    private _disconnect$: Subject<void> = new Subject<void>();
    protected Element$: Observable<HTMLElement> = this._elementSubject$.asObservable().pipe(
        filter(x => !!x)
    );
    protected Events$ = this._eventsSubject$.asObservable();
    protected Attributes$: Observable<any> = this._attributesSubject$.asObservable().pipe(
        scan<{ name, value }, any>((acc, val) => ({...acc, [val.name]: val.value}), {}),
        startWith({}),
    );

    protected ClientRect$ = this.Element$.pipe(
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
        shareReplay(1)
    );
    protected Render$ = new ReplaySubject();

    protected select<E extends Element = Element>(selector: string): Observable<E | null> {
        return this.Render$.asObservable().pipe(
            withLatestFrom(this.Element$),
            map(([_, element]) => element.querySelector(selector))
        );
    }

    private _injectedContent$ = new ReplaySubject<(HTMLElement|SVGElement)[]>();
    protected InjectedContent$ = this._injectedContent$.asObservable();

    protected Events: Partial<TEvents>;
}
