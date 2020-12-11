import {Container} from "@hypertype/core";
import {Application} from "./application";

export const AppContainer = new Container();

AppContainer.provide([
    Application,
]);
