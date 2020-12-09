import {Container} from "@hypertype/core";
import {Application} from "./application";
import {Logger} from "./logger";

export const AppContainer = new Container();

AppContainer.provide([
    Application,
    {provide: Logger}
]);
