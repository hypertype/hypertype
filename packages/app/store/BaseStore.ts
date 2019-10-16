import {Reducer, AnyAction} from "redux";
import {Epic} from "./redux-observable/index";
import {downgradeAction, objectReducer} from "./reducers";
import {ActionsCreator} from "./ActionsCreator";
import {Subject} from "@hypertype/core";
import {Store} from "./store";
import {NEVER} from "@hypertype/core";

export class BaseStore<TState> {
    public path: (string | number)[] = [];
    public Actions = new ActionsCreator<TState>();
    protected parentStore: BaseStore<any>;
    protected store: Store<TState>;
    protected StoresMap: {} = {};
    protected epic: { epic$: Epic<any, TState> } = {
        epic$: (action$, store) => NEVER
    };
    protected reducer: { reduce: Reducer<TState> } = {
        reduce: objectReducer<TState>(x => x)
    };

    constructor(parentStore: BaseStore<any>, protected key: string) {
        if (!parentStore)
        // костыль для rootStore
            return;
        this.parentStore = parentStore;
        this.store = this.parentStore.store;
        parentStore.Register(this, key);
        setTimeout(() => this.Init());
    }

    protected get epicRegistrator() {
        return this.parentStore.epicRegistrator;
    }

    protected get combinedReducer() {
        return (state: TState = <any>null, action) => {
            try {
                if (!action.type) return state;
                const keys = action.type.split(".");
                const key = keys[0];
                const targetStore: BaseStore<any> = this.StoresMap[key];
                if (!targetStore)
                    return this.reducer.reduce(state, action);
                const newSubState = targetStore.reduce(state && state[key] || null, downgradeAction(action));
                return Object.assign({}, state, {
                    [key]: newSubState
                });
            } catch (e) {
                console.log(e);
                return state;
            }
        };
    }

    public dispatch<A extends AnyAction>(action: A) {
        return this.store.dispatch(action);
    }

    public Register<TChildState>(childStore: BaseStore<TChildState>,
                                 key: string) {
        this.StoresMap[key] = childStore;
        childStore.path = [...this.path, key];
        // console.log('registered', childStore.path.join('.'));
        // setTimeout(() =>childStore.Init({}));
    }

    public reduce(state, action) {
        return this.combinedReducer(state, action);
    }

    public getState(): TState {
        return this.parentStore.getState()[this.key];
    }

    protected Init(state = {}) {
        // Object.keys(this.StoresMap).forEach(key => this.StoresMap[key].Init());
        this.Actions.InitActionCreator(this.store, this.path, state);
        this.epicRegistrator(this.epic.epic$, this);
        this.OnInit.next(state);
        this.OnInit.complete();
    }

    public OnInit = new Subject();
}
