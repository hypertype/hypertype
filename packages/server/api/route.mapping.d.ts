import { ControllerInfo } from './base/controller.info';
export interface RouterFunction {
    (injector: any): InstanceFunction;
}
export interface InstanceFunction {
    (query: any, headers: any): Promise<any>;
}
export declare const routing: {
    routeMapping: Map<string, ControllerInfo>;
    routePrefix: (routePrefix?: string) => (constructor: any) => void;
    route: any;
};
//# sourceMappingURL=route.mapping.d.ts.map