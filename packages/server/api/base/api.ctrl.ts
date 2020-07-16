import {Container} from "@hypertype/core";

export class ApiController {
	protected Instantiate<T>(type) {
		return <T>this.injector.get(type);
	}

	constructor(protected injector: Container) {

	}
}
