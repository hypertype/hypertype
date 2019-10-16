import {StateLogger} from "@hypertype/infr";

const devToolsName = '__REDUX_DEVTOOLS_EXTENSION__';

export class DevToolsStateLogger extends StateLogger {
    private devTools: any;

    constructor() {
        super();
        if (window[devToolsName]) {
            this.devTools = window[devToolsName].connect({
                name: document.title
            });
            this.devTools.init();
        }
    }


    public send({type, payload}: { type: any; payload: any; }, state: any) {
        if (this.devTools) {
            this.devTools.send({
                type, payload
            }, state);
        }
    }

}
