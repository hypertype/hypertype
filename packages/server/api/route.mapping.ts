import {ControllerInfo} from './base/controller.info';

export interface RouterFunction {
    (injector): InstanceFunction;
}

export interface InstanceFunction {
    (query, headers): Promise<any>;
}

export const routing = {
    routeMapping: new Map<string, ControllerInfo>(),

    routePrefix: (routePrefix: string = "") => constructor => {
        const controllerInfo = routing.routeMapping.get(constructor.name) || new ControllerInfo();
        controllerInfo.prefix = routePrefix;
        controllerInfo.class = constructor;
        routing.routeMapping.set(constructor.name, controllerInfo);
    },

    route: <any>((target, key?, descriptor?, routeName: string = '') => {
        if (key === undefined || descriptor === undefined)
            return (t, key, descriptor) => routing.route(t, key, descriptor, target);
        //if (!target.constructor.routes) target.constructor.routes = [];
        const controllerInfo = routing.routeMapping.get(target.constructor.name) || new ControllerInfo();
        controllerInfo.addRoute(routeName, instance => {
            return instance[key].bind(instance);
        });
        routing.routeMapping.set(target.constructor.name, controllerInfo);
        return descriptor;
    })
};
