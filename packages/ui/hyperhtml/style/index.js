/*! (c) Andrea Giammarchi - ISC */
'use strict';
// from https://github.com/developit/preact/blob/33fc697ac11762a1cb6e71e9847670d047af7ce5/src/varants.js
const IS_NON_DIMENSIONAL = /acit|ex(?:s|g|n|p|$)|rph|ows|mnc|ntw|ine[ch]|zoo|^ord/i;
const hyphen = /([^A-Z])([A-Z]+)/g;

export function hyperStyle(node, original) {
    return 'ownerSVGElement' in node ? svg(node, original) : update(node.style, false);
};

function ized($0, $1, $2) {
    return $1 + '-' + $2.toLowerCase();
}

function svg(node, original) {
    let style;
    if (original)
        style = original.cloneNode(true);
    else {
        node.setAttribute('style', '--hyper:style;');
        style = node.getAttributeNode('style');
    }
    style.value = '';
    node.setAttributeNode(style);
    return update(style, true);
}

function toStyle(object) {
    let key;
    const css = [];
    for (key in object)
        css.push(key.replace(hyphen, ized), ':', object[key], ';');
    return css.join('');
}

function update(style, isSVG) {
    let oldType, oldValue;
    return function (newValue) {
        let info, key, styleValue, value;
        switch (typeof newValue) {
            case 'object':
                if (newValue) {
                    if (oldType === 'object') {
                        if (!isSVG) {
                            if (oldValue !== newValue) {
                                for (key in oldValue) {
                                    if (!(key in newValue)) {
                                        style[key] = '';
                                    }
                                }
                            }
                        }
                    } else {
                        if (isSVG)
                            style.value = '';
                        else
                            style.cssText = '';
                    }
                    info = isSVG ? {} : style;
                    for (key in newValue) {
                        value = newValue[key];
                        styleValue = typeof value === 'number' &&
                        !IS_NON_DIMENSIONAL.test(key) ?
                            (value + 'px') : value;
                        if (!isSVG && /^--/.test(key))
                            info.setProperty(key, styleValue);
                        else
                            info[key] = styleValue;
                    }
                    oldType = 'object';
                    if (isSVG)
                        style.value = toStyle((oldValue = info));
                    else
                        oldValue = newValue;
                    break;
                }
            default:
                if (oldValue != newValue) {
                    oldType = 'string';
                    oldValue = newValue;
                    if (isSVG)
                        style.value = newValue || '';
                    else
                        style.cssText = newValue || '';
                }
                break;
        }
    };
}
