import {UI} from "./src/ui";
import {Container} from "@hypertype/core";
import { render } from "uhtml";

import "./src/uhandlers";

export {html, svg, render} from "uhtml";

export * from "./src/component";
export * from "./src/hyper.component";

export const init: (container: Container) => void = UI.init;

export * from "./src/helpers";
export * from './helpers/events';
