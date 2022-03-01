import {UI} from "./src/ui";
import {Container} from "@hypertype/core";

import "./src/uhandlers";

export {html, svg, render} from "@cmmn/uhtml";

export * from "./src/component";
export * from "./src/hyper.component";

export const init: (container: Container) => void = UI.init;

export * from "./src/helpers";
export * from './helpers/events';
