import { RouterFunction } from '../route.mapping';
export declare class ControllerInfo {
    constructor();
    prefix: string;
    class: any;
    routes: Map<string, RouterFunction>;
    addRoute(path: string, action: RouterFunction): void;
}
//# sourceMappingURL=controller.info.d.ts.map