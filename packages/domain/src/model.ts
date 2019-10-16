import {
    distinctUntilChanged,
    Fn,
    map,
    Observable,
    shareReplay,
    startWith,
    Subject,
    switchMap,
    tap
} from "@hypertype/core";
import {IInvoker} from "./model.stream";

export abstract class Model<TState, TActions> implements IModel<TState, TActions> {

    protected StateSubject$: Subject<void> = new Subject<void>();

    public State$: Observable<TState> = this.StateSubject$.asObservable().pipe(
        startWith(null as void),
        map(() => this.ToJSON()),
        distinctUntilChanged(null, Fn.crc32),
        shareReplay(1),
    );

    private InvokeSubject$ = new Subject<{ action: { path; method; args }, resolve: Function, reject: Function }>();
    private Invoke$ = this.InvokeSubject$.pipe(
        switchMap(({action, resolve, reject}) => {
            // console.log('action start', action.path, action.method, action.args);
            try {
                const res: any = this.GetSubActions(...(action.path || []))[action.method](...action.args);
                if (res.then) {
                    return res.then(result => {
                        // if (!result)
                        // this.Update();
                        resolve(result)
                    }).catch(reject);
                } else {
                    resolve(res);
                    return res;
                }
            } catch (e) {
                reject(e);
                // throw e;
            }
        }),
        tap(() => this.Update())
    ).subscribe();

    public Invoke: IInvoker<TActions> = action => {
        return new Promise((resolve, reject) => this.InvokeSubject$.next(({action, resolve, reject})));
    };

    public abstract ToJSON(): TState;

    public abstract FromJSON(state: TState);

    Update = () => {
        this.StateSubject$.next();
    };

    protected GetSubModel<TState, TActions>(...path: any[]): Model<TState, TActions> {
        const model = this.GetSubState(this, ...path) as Model<TState, TActions>;
        if (!model)
            return  null;
        model.Update = this.Update;
        return model;
    }

    private GetSubActions(...path: any[]): IActions<TActions> {
        return this.GetSubModel(...path) as unknown as IActions<TActions>;
    }

    private GetSubState(state, ...path) {
        if (!state)
            return null;
        if (!path.length)
            return state;
        if (Array.isArray(state))
            return this.GetSubState(state.find(s => s.Id == path[0]), ...path.slice(1));
        return this.GetSubState(state[path[0]], ...path.slice(1));
    }
}

export type IModel<TState, TActions> = {
    ToJSON(): TState;
    FromJSON(state: TState);
};

export type IActions<TActions> = {
    [key in keyof TActions]: (...args) => void;
}
