import {concatMap, distinctUntilChanged, map, Observable, shareReplayRC, startWith, Subject} from "@hypertype/core";
import {IAction, IInvoker} from "./model.stream";
import {Fn} from "@hypertype/core";

/* @obsolete use Fn.compare from core package*/
export const compare = Fn.compare;

export abstract class Model<TState, TActions> implements IModel<TState, TActions> {

  protected StateSubject$: Subject<void> = new Subject<void>();

  public State$: Observable<TState> = this.StateSubject$.asObservable().pipe(
    startWith(null as void),
    map(() => ({
      ...this.ToJSON(),
      lastUpdate: this.lastUpdate
    })),
    distinctUntilChanged(compare),
    shareReplayRC(1),
  );

  private lastUpdate: string;
  /**
   * Включает фильтрацию устаревших обновлений домена:
   * Клиент быстро отправляет 3-4 action в домен, ответ на первое приходит с задержкой.
   * Стейт на клиенте уже учитывает эти экшены, а из домена пришел учитывающий только одно из них
   * @protected
   */
  protected useLastUpdate = false;

  private InvokeSubject$ = new Subject<{ action: IAction<TActions>, resolve: Function, reject: Function }>();
  private Invoke$ = this.InvokeSubject$.pipe(
    /**
     * Идея в сериализации а-ля ReadCommitted:
     * Обновления идут по очереди, не мешая друг другу и обновляют стейт.
     * Get-запросы не создают очередь, а только ждут обновления, которые уже в очереди.
     * В идеале нужно группировать Get-запросы и ждать Promise.all(getRequests) иначе возможна проблема:
     * В процессе выполнения Get-запроса пришел Action, который изменил состояние
     *      => Get использует неконсистентное состояние.
     *      Поэтому все Get должны в начале прочесть все нужные данные, а уже потом делать дела
     */
    concatMap(async ({action, resolve, reject}: {action: IAction<TActions>, resolve: Function, reject: Function}) => {
      // console.log('action start', action.path, action.method, action.args);
      try {
        const model = this.GetSubActions<TActions>(...(action.path || [])) as any;
        if (!action.method.startsWith('Get')) {
          const result: any = await model[action.method](...action.args);
          resolve(result);
          if (this.useLastUpdate) {
            this.lastUpdate = action.lastUpdate;
          }
          this.Update();
        } else {
          const promiseOrResult = model[action.method](...action.args);
          if (promiseOrResult instanceof Promise) {
            promiseOrResult.then(x => resolve(x)).catch(x => reject(x));
          } else {
            resolve(promiseOrResult);
          }
        }
      } catch (e) {
        console.error(e);
        reject(e);
        // throw e;
      }
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

  private GetSubActions<UActions>(...path: any[]): UActions {
    return this.GetSubModel(...path) as unknown as UActions;
  }

  private GetSubState(state, ...path) {
    if (!state)
      return null;
    if (!path.length)
      return state;
    if (state instanceof Map) {
      return this.GetSubState(state.get(path[0]), ...path.slice(1));
    }
    if (Array.isArray(state))
      return this.GetSubState(state.find(s => s.Id == path[0]), ...path.slice(1));
    return this.GetSubState(state[path[0]], ...path.slice(1));
  }
}

export type IModel<TState, TActions> = {
  ToJSON(): TState;
  FromJSON(state: TState);
};
