"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newComponent = void 0;
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
function newComponent(directoryPath, componentName) {
    fs.mkdirSync(path.join(directoryPath, componentName));
    const componentNameClass = componentName.replace(/(^.|\-.)/g, ch => ch[ch.length - 1].toUpperCase());
    fs.writeFileSync(path.join(directoryPath, componentName, `${componentName}.style.less`), `ctx-${componentName} {
  display: block;
}
`, 'utf8');
    fs.writeFileSync(path.join(directoryPath, componentName, `${componentName}.template.ts`), `import {IEventHandler, wire} from "@hypertype/ui";

export const Template = (html, state: IState, events: IEventHandler<IEvents>) => html\`
    This is ${componentName}. \${wire(html, 'state')\`
        <code>\${JSON.stringify(state)}</code>
    \`}
\`;

export interface IState {

}

export interface IEvents {

}
    `, 'utf8');
    fs.writeFileSync(path.join(directoryPath, componentName, `${componentName}.component.ts`), `import {Component, HyperComponent} from "@hypertype/ui";
import {IEvents, IState, Template} from "./${componentName}.template";

@Component({
    name: 'ctx-${componentName}',
    template: Template,
    style: require('./${componentName}.style.less')
})
export class ${componentNameClass}Component extends HyperComponent<IState, IEvents>{

}
    `, 'utf8');
}
exports.newComponent = newComponent;
