import { RouterFunction } from '../route.mapping';

export class ControllerInfo {
	constructor() {
	}

	public prefix: string;

	public class: any;

	public routes: Map<string, RouterFunction> = new Map<string, RouterFunction>();

	public addRoute(path: string, action: RouterFunction) {
		this.routes.set(path, action);
	}
}
