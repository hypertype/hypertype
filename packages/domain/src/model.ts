import {
  concatMap,
  distinctUntilChanged,
  Fn,
  map,
  Observable,
  shareReplay,
  startWith,
  Subject,
  tap
} from "@hypertype/core";
import {IInvoker} from "./model.stream";

/**
 * Сравнивает два объекта, учитывает DateTime, Duration, array, object
 * @param a
 * @param b
 * @returns {boolean}
 */
export function compare(a,b){
  if (["string", "number", "boolean", "function"].includes(typeof a))
    return a === b;
  if (a === b)
    return  true;
  if (a == null && b == null)
    return true;
  if (a == null || b == null)
    return false;
  if (a.equals && b.equals)
    return a.equals(b);
  if (Array.isArray(a) && Array.isArray(b)){
    return a.length === b.length &&
      a.every((x,i) => compare(x,b[i]));
  }
  if (typeof a === "object" && typeof b === "object"){
    const aKeys = Object.getOwnPropertyNames(a);
    const bKeys = Object.getOwnPropertyNames(b);
    if (!compare(aKeys, bKeys))
      return false;
    return aKeys.every(key => compare(a[key], b[key]));
  }
  return false;
}

export abstract class Model<TState, TActions> implements IModel<TState, TActions> {

  protected StateSubject$: Subject<void> = new Subject<void>();

  public State$: Observable<TState> = this.StateSubject$.asObservable().pipe(
    startWith(null as void),
    map(() => this.ToJSON()),
    distinctUntilChanged(compare),
    shareReplay(1),
  );

  private InvokeSubject$ = new Subject<{ action: { path; method; args }, resolve: Function, reject: Function }>();
  private Invoke$ = this.InvokeSubject$.pipe(
    concatMap(async ({action, resolve, reject}) => {
      // console.log('action start', action.path, action.method, action.args);
      try {
        const result: any = await this.GetSubActions(...(action.path || []))[action.method](...action.args);
        resolve(result);
      } catch (e) {
        console.error(e);
        reject(e);
        // throw e;
      }
      if (!action.method.startsWith('Get'))
        this.Update();
    }),
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
      return null;
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
