import {UI} from "./src/ui";
import {Container} from "@hypertype/core";

export {HyperElement, wire, bind} from "./hyperhtml/hyper.element";

export * from "./src/component";
export * from "./src/hyper.component";

export const init: (container: Container) => void = UI.init;

export * from "./src/helpers";
export * from './helpers/events';
