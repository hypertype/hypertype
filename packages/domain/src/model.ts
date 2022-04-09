import {Model as CmmnModel, ModelAction, ModelPath} from "@cmmn/domain/worker";
import {Cell} from "@cmmn/cell";

export abstract class Model<TState, TActions extends ModelAction> extends CmmnModel<TState, TActions> implements IModel<TState, TActions> {

  constructor() {
    super();
  }

  $state = new Cell(null as TState);

  public get State(): TState{
    return this.ToJSON();
  }
  public set State(value: TState){
    this.FromJSON(value);
  }

  public abstract ToJSON(): TState;

  public abstract FromJSON(state: TState);

  Update = () => {
    this.$state.set(this.ToJSON());
  };

  Actions = new Proxy(this, {
    get(target, key: string){
      return async (...args) => {
        const res = await target[key](...args);
        if (!key.startsWith('Get'))
          target.Update();
        return res;
      }
    }
  }) as any as TActions;

  public QueryModel(path: ModelPath): Model<any, any>{
    return super.QueryModel(path.slice()) as Model<any, any>;
  }
}

export type IModel<TState, TActions> = {
  ToJSON(): TState;
  FromJSON(state: TState);
};
