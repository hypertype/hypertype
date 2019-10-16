import {UI} from "./src/ui";
import {Container} from "@hypertype/core";
import HyperHTMLElement from "hyperhtml-element/esm";

export * from "./src/component";
export * from "./src/hyper.component";

export const init: (container: Container) => void = UI.init;

export * from "./src/helpers";
export * from './helpers/events';

export const wire = HyperHTMLElement.wire;
export const bind = HyperHTMLElement.bind;