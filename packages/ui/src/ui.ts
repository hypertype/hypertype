import {Container} from "@hypertype/core";
import {defineComponents} from "./component";

export class UI {
    public static container: Container;

    public static init(container: Container){
        UI.container = container;
        defineComponents();
    }
};