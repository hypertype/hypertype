import {routing, RouterFunction, InstanceFunction} from './route.mapping';
import {Router, Request} from 'express';
import {ControllerInfo} from './base/controller.info';
import {NEVER} from "@hypertype/core";

export class ApiRouter {

    constructor(protected container: any,
                protected mapping: Map<string, ControllerInfo> = routing.routeMapping) {
    }

    public init(router: Router) {
        this.mapping.forEach((info: ControllerInfo) => {
            this.registerController(router, info)
        });
    }

    protected registerController(router, info: ControllerInfo) {
        const instance = new info.class(this.container);
        info.routes.forEach((action: RouterFunction, route) => {
            router.all(`/${info.prefix}/${route}`, this.Middleware(action(instance)),);
        });
    }

    //
    // private store: RootStore = null;
    // private persist = container => {
    //     const appStore = container.get('AppStore');
    //     console.log('state persistance: ', appStore.getState());
    //     if (this.store)
    //         appStore.initStore(this.store.getState());
    //     this.store = appStore;
    //     return container;
    // };

    protected Middleware: any = (action: InstanceFunction) => (req: Request, res, next) => {
        return action(req.query, req.headers)
            .then(result => {
                for (let key in result.headers){
                    res.setHeader(key, result.headers[key]);
                }
                res.status(result.status || 200);
                res.send(result.data);
            })
            .catch((e: Error) => {
                res.status(500);
                res.setHeader('Content-Type', 'text/html');
                res.send({
                    message:e.message,
                    stack: e.stack.split('\n'),
                    name: e.name
                });
                // console.error(e);
                return NEVER;
            });
    };


}
