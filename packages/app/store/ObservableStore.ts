import {Epic} from './redux-observable';
import {BaseStore} from './BaseStore';
import {Action, Reducer} from 'redux';
import {Observable} from "@hypertype/core";
import {ReplaySubject} from "@hypertype/core";
import {mergeMap} from "@hypertype/core";

/**
 * Created by xamidylin on 19.06.2017.
 */

export interface ObservableState<T extends Action> {
    actions: any;
    reducer: { reduce: Reducer<T> };
    epic: { epic$: Epic<T, any> };
}

export class ObservableStore<TState> extends BaseStore<TState> {
    private keys: string[];
    protected parentStore: ObservableStore<any>;

    constructor(parentStore: any, key: string) {
        super(parentStore, key);
        this.parentStore = parentStore;
    }

    public selector = state => {
        const parentState = this.parentStore.selector(state);
        return parentState && parentState[this.key] || null;
    };

    public getState() {
        return this.selector(this.store.getState());
    }

    public asObservable(): Observable<TState> {
        return this.state$;
    }

    private initSubject = new ReplaySubject<any>(1);
    private state$: Observable<TState> = this.initSubject.asObservable().pipe(
        mergeMap(a => this.store.select(this.selector))
    );

    protected Init(state = {}) {
        super.Init(state);
        this.initSubject.next('init');
        this.initSubject.complete();
    }


}


