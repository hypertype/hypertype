const path = require('path');
const fs = require('fs');

module.exports = function newComponent(directoryPath, componentName) {
    fs.mkdirSync(path.join(directoryPath, componentName));
    const componentNameClass = componentName[0].toUpperCase() + componentName.substr(1);
    fs.writeFileSync(path.join(directoryPath, componentName, `${componentName}.style.less`),
        `ctx-${componentName} {
  display: block;
}
`, 'utf8');
    fs.writeFileSync(path.join(directoryPath, componentName, `${componentName}.template.ts`),
        `import {IEventHandler, wire} from "@hypertype/ui";

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
    fs.writeFileSync(path.join(directoryPath, componentName, `${componentName}.component.ts`),
        `import {Component, HyperComponent} from "@hypertype/ui";
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