// import {BaseStore} from './BaseStore';
// import {Observable} from "@hypertype/core";
// import {distinctUntilChanged, map, shareReplay, flatMap, filter} from "@hypertype/core";
// import {downgradeAction} from './reducers';
// import {ObservableStore} from './ObservableStore';
//
// export class ObservableArrayStore<TState, TItemStore extends ObservableStore<TState>> extends ObservableStore<TState[]> {
//     constructor(parentStore: BaseStore<any>, key: string, private ItemStore) {
//         super(parentStore, key)
//     }
//
//     protected Init(state = []) {
//         this.StoresMap$.subscribe();
//         super.Init(state);
//     }
//
//     protected ItemKey = 'Id';
//     protected KeyGetter = item => item[this.ItemKey];
//
//     public Items: Observable<TState[]> = this.asObservable().pipe(filter(Array.isArray));
//
//     /**
//      * При каждом изменении массива ключей создает новый child-Store
//      * и кладет его в StoresMap
//      */
//     public StoresMap$: Observable<{ key: any, store: TItemStore }[]> = this.Items.pipe(
//         map(arr => arr.map(this.KeyGetter)),
//         distinctUntilChanged(Fn.arrayEqual),
//         map(ids => ids.map((id: any) => ({
//             key: id,
//             store: this.getOrCreate(id)
//         }))),
//         shareReplay()
//     );
//
//     /**
//      * Создает новый child-Store или возвращает уже существующий
//      */
//     private getOrCreate(key, filter = item => this.KeyGetter(item) == key): TItemStore {
//         if (this.StoresMap[key]) return this.StoresMap[key];
//         const store: TItemStore = new this.ItemStore(this, key);
//         store.selector = state => {
//             const currentState = this.selector(state);
//             if (!currentState) return null;
//             return currentState.filter(filter)[0];
//         };
//         return this.StoresMap[key] = store;
//     }
//
//     getById(key): Observable<TState> {
//         return this.StoresMap$.pipe(
//             flatMap(map => map.filter(d => d.key == key)),
//             map(d => d.store),
//             flatMap(store => store.asObservable())
//         );
//     }
//
//     protected get combinedReducer() {
//         return (state: TState[] = [], action) => {
//             if (!action.type) return state;
//             try {
//                 const keys = action.type.split('.');
//                 const key = keys[0];
//                 if (key in this.StoresMap) {
//                     const oldState = this.StoresMap[key].getState();
//                     const index = state.indexOf(oldState);
//                     const newState = this.StoresMap[key].reduce(downgradeAction(action));
//                     return [
//                         ...state.slice(0, index),
//                         newState,
//                         ...state.slice(index + 1)
//                     ];
//                 }
//                 return this.reducer.reduce(state, action);
//             } catch (e) {
//                 console.log(e);
//                 return state;
//             }
//         }
//     }
// }
