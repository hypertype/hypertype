/*! (c) Andrea Giammarchi - ISC */

// Custom
let UID = '-' + Math.random().toFixed(6) + '%';
//                           Edge issue!

let UID_IE = false;

try {
  if (!(function (template, content, tabindex) {
    return content in template && (
      (template.innerHTML = '<p ' + tabindex + '="' + UID + '"></p>'),
      template[content].childNodes[0].getAttribute(tabindex) == UID
    );
  }(document.createElement('template'), 'content', 'tabindex'))) {
    UID = '_dt: ' + UID.slice(1, -1) + ';';
    UID_IE = true;
  }
} catch(meh) {}

const UIDC = '<!--' + UID + '-->';

// DOM
const COMMENT_NODE = 8;
const DOCUMENT_FRAGMENT_NODE = 11;
const ELEMENT_NODE = 1;
const TEXT_NODE = 3;

const SHOULD_USE_TEXT_CONTENT = /^(?:style|textarea)$/i;
const VOID_ELEMENTS = /^(?:area|base|br|col|embed|hr|img|input|keygen|link|menuitem|meta|param|source|track|wbr)$/i;

export {
  UID, UIDC, UID_IE,
  COMMENT_NODE,
  DOCUMENT_FRAGMENT_NODE,
  ELEMENT_NODE,
  TEXT_NODE,
  SHOULD_USE_TEXT_CONTENT,
  VOID_ELEMENTS
};
