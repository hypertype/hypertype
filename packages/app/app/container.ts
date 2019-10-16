import {Container} from "@hypertype/core";
import {Application} from "./application";
import {Logger} from "./logger";
import {RootStore} from "../store";
import {StateLogger} from "@hypertype/infr";

export const AppContainer = new Container();

AppContainer.provide([
    // {provide: AppRoot, multiple: true},
    Application,
    {provide: Logger}
]);
