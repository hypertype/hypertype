/*! (c) Andrea Giammarchi - ISC */

import {UID, UIDC, VOID_ELEMENTS} from '../domconstants';

export function sanitize (template) {
    return template.join(UIDC)
        .replace(selfClosing, fullClosing)
        .replace(attrSeeker, attrReplacer);
}

const spaces = ' \\f\\n\\r\\t';
const almostEverything = '[^' + spaces + '\\/>"\'=]+';
const attrName = '[' + spaces + ']+' + almostEverything;
const tagName = '<([A-Za-z]+[A-Za-z0-9:._-]*)((?:';
const attrPartials = '(?:\\s*=\\s*(?:\'[^\']*?\'|"[^"]*?"|<[^>]*?>|' + almostEverything.replace('\\/', '') + '))?)';
const attrSeeker = new RegExp(tagName + attrName + attrPartials + '+)([' + spaces + ']*/?>)', 'g');
const selfClosing = new RegExp(tagName + attrName + attrPartials + '*)([' + spaces + ']*/>)', 'g');
const findAttributes = new RegExp('(' + attrName + '\\s*=\\s*)([\'"]?)' + UIDC + '\\2', 'gi');

function attrReplacer($0, $1, $2, $3) {
    return '<' + $1 + $2.replace(findAttributes, replaceAttributes) + $3;
}

function replaceAttributes($0, $1, $2) {
    return $1 + ($2 || '"') + UID + ($2 || '"');
}

function fullClosing($0, $1, $2) {
    return VOID_ELEMENTS.test($1) ? $0 : ('<' + $1 + $2 + '></' + $1 + '>');
}
