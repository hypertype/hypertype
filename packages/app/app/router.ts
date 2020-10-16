import createRouter, {Options, Route, RouteNode, Router as Router5, State as RouterState} from 'router5';
import * as browserPlugin from 'router5-plugin-browser';
import {Observable, shareReplay, startWith} from "@hypertype/core";

export class IRouterOptions {
  routes: Route[] | RouteNode;
  options: Options;
}

export class Router {
  public State$: Observable<RouterState>;
  private router: Router5;
  public Actions: {
    [K in keyof IRouteActions]: (...args: any[]) => void;
  } = {
    navigate: (route: string, params: any) => {
      this.router.navigate(route, params);
    }
  };

  constructor(routerInit: IRouterOptions) {
    this.router = createRouter(routerInit.routes, routerInit.options);
    this.router.usePlugin((browserPlugin as any)());
    this.router.start();
    this.State$ = new Observable<RouterState>(subscr => {
      this.router.subscribe(change => subscr.next(change.route as RouterState))
    }).pipe(
      startWith(this.router.getState() as RouterState),
      shareReplay(1)
    );
  }
}

export interface IRouteActions {
  navigate(route: string);
}

export {
  RouterState
}
