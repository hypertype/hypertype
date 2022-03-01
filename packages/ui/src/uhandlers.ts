import {setter, useCustomHandler} from "@cmmn/uhtml";
import { propertySymbol } from "./component";

useCustomHandler(component);
useCustomHandler(style);

function component(node, name){
  if (node.component && name in node.component.constructor[propertySymbol])
    return setter(node, name);
}

function style(node, name){
  if (name !== 'style')
    return null;
  let oldValue = {};
  return newValue => {
    if (typeof newValue === "string" && newValue !== oldValue){
      node.style = newValue;
    }else {
      for (let key in newValue) {
        if (newValue[key] != oldValue[key]) {
          const camelKey = camelize(key);
          node.style[camelKey] = oldValue[key] = newValue[key];
        }
      }
    }
  }
}

function camelize(str) {
  return str.replace(/(?:^\w|[A-Z]|\b\w)/g, function(word, index) {
    return index === 0 ? word.toLowerCase() : word.toUpperCase();
  }).replace(/[\s-]+/g, '');
}
