import {isArray} from 'uarray';

export const aria = node => values => {
  for (const key in values) {
    const name = key === 'role' ? key : `aria-${key}`;
    const value = values[key];
    if (value == null)
      node.removeAttribute(name);
    else
      node.setAttribute(name, value);
  }
};

const customHandlers = [];
export function useCustomHandler(handler){
  customHandlers.push(handler);
}

export const attribute = (node, name) => {
  for (let customHandler of customHandlers) {
    const handler = customHandler(node, name);
    if (handler)
      return handler;
  }
  let oldValue, orphan = true;
  const attributeNode = document.createAttributeNS(null, name);
  return newValue => {
    if (oldValue !== newValue) {
      oldValue = newValue;
      if (oldValue == null) {
        if (!orphan) {
          node.removeAttributeNode(attributeNode);
          orphan = true;
        }
      }
      else {
        attributeNode.value = newValue;
        if (orphan) {
          node.setAttributeNodeNS(attributeNode);
          orphan = false;
        }
      }
    }
  };
};

export const boolean = (node, key, oldValue) => newValue => {
  if (oldValue !== !!newValue) {
    // when IE won't be around anymore ...
    // node.toggleAttribute(key, oldValue = !!newValue);
    if ((oldValue = !!newValue))
      node.setAttribute(key, '');
    else
      node.removeAttribute(key);
  }
};

export const data = ({dataset}) => values => {
  for (const key in values) {
    const value = values[key];
    if (value == null)
      delete dataset[key];
    else
      dataset[key] = value;
  }
};

export const event = (node, name) => {
  let oldValue, oldUnsubscriber, type = name.slice(2);
  if (!(name in node) && name.toLowerCase() in node)
    type = type.toLowerCase();
  return newValue => {
    const info = isArray(newValue) ? newValue : [newValue, false];
    if (oldValue !== info[0]) {
      if (oldValue)
        node.removeEventListener(type, oldValue, info[1]);
      if (info[0]) {
        oldValue = info[0]
        node.addEventListener(type, oldValue, info[1]);
        if (newValue[2] && newValue[2] !== oldUnsubscriber){
          oldUnsubscriber = newValue[2];
          newValue[2](() => {
            node.removeEventListener(type, oldValue, info[1]);
            oldValue = undefined;
            oldUnsubscriber = undefined;
          });
        }
      }
    }
  };
};

export const ref = node => {
  let oldValue;
  return value => {
    if (oldValue !== value) {
      oldValue = value;
      if (typeof value === 'function')
        value(node);
      else
        value.current = node;
    }
  };
};

export const setter = (node, key) => key === 'dataset' ?
  data(node) :
  value => {
    node[key] = value;
  };

export const text = node => {
  let oldValue;
  return newValue => {
    if (oldValue != newValue) {
      oldValue = newValue;
      node.textContent = newValue == null ? '' : newValue;
    }
  };
};
