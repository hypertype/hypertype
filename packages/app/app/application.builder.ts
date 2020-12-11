import {Container} from "@hypertype/core";
import {IRouterOptions, Router} from "./router";
import {Application} from "./application";
import {RootStore, Store} from "../store";
import {ApiLogFactory, ConsoleLogFactory, Factory, LogApiUrl, Logger, StateLogger} from "@hypertype/infr";

export class ApplicationBuilder {

  private static container: Container = new Container();

  public static build(): Application {
    this.container.provide([
      // {provide: AppRoot, multiple: true},
      {provide: RootStore, useClass: RootStore, deps: [StateLogger]},
      {provide: Application, deps: [Container, RootStore]},
      {provide: Router, deps: [IRouterOptions]},
      {provide: Logger}
    ]);
    return this.container.get<Application>(Application);
  }

  public static withRouter(options: IRouterOptions): typeof ApplicationBuilder {
    this.container.provide([{provide: IRouterOptions, useValue: options}]);
    return this;
  }

  public static withUI(uiContainer: Container): typeof ApplicationBuilder {
    this.container.provide(uiContainer);
    return this;
  }

  public static withInfrustructure(infrContainer: Container): typeof ApplicationBuilder {
    this.container.provide(infrContainer);
    return this;
  }

  public static withStores(...stores: Store<any>[]): typeof ApplicationBuilder {
    this.container.provide(stores.map(s => ({provide: s})));
    return this;
  }

  public static withConsoleLogging(): typeof ApplicationBuilder {
    Logger.Factory = ConsoleLogFactory;
    return this;
  }

  public static withApiLogging(url: string): typeof ApplicationBuilder {
    this.container.provide([{provide: LogApiUrl, useValue: url}, ApiLogFactory]);
    Logger.Factory = (() => {
      const factory = this.container.get<ApiLogFactory>(ApiLogFactory)
      return factory.Factory();
    }) as Factory<Logger>;
    return this;
  }
}

