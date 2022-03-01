import {Model as CmmnModel, WorkerEntry} from "@cmmn/domain/worker";
import {Container} from "@hypertype/core";
import {Model} from "./model";
import {RootFactory} from "./root.factory";


export class SimpleWebWorkerEntry {

  static Start(self, container: Container) {

    const aggregate = container.get<Model<any, any>>(Model);
    const entry = new WorkerEntry(new RootFactory(aggregate));
  }

}
