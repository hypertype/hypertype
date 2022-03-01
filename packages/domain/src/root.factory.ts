import {Model} from "./model";
import {IFactory, Model as CmmnModel, ModelAction, ModelPath, WorkerEntry} from "@cmmn/domain/worker";

export class RootFactory extends IFactory {
  constructor(private root: Model<any, any>) {
    super();
  }

  GetModel<TState, TActions extends ModelAction = {}>(path: ModelPath): CmmnModel<TState, TActions> {
    return this.Root.QueryModel(path);
  }

  Root = this.root;
}
