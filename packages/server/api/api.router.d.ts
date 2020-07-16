import { InstanceFunction } from './route.mapping';
import { Router, Request } from 'express';
import { ControllerInfo } from './base/controller.info';
import { Container } from "@hypertype/core";
export declare class ApiRouter {
    protected container: Container;
    protected mapping: Map<string, ControllerInfo>;
    constructor(container: Container, mapping?: Map<string, ControllerInfo>);
    init(router: Router): void;
    protected registerController(router: any, info: ControllerInfo): void;
    protected Middleware: (action: InstanceFunction) => (req: Request, res: any, next: any) => Promise<void | import("../../../../hypertype/packages/core/dist/typings").Observable<never>>;
}
//# sourceMappingURL=api.router.d.ts.map