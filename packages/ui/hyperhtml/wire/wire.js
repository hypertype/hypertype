/*! (c) Andrea Giammarchi - ISC */
const slice = [].slice;
const proto = Wire.prototype;

proto.ELEMENT_NODE = 1;
proto.nodeType = 111;

proto.remove = function (keepFirst) {
    const childNodes = this.childNodes;
    const first = this.firstChild;
    const last = this.lastChild;
    this._ = null;
    if (keepFirst && childNodes.length === 2) {
        last.parentNode.removeChild(last);
    } else {
        const range = this.ownerDocument.createRange();
        range.setStartBefore(keepFirst ? childNodes[1] : first);
        range.setEndAfter(last);
        range.deleteContents();
    }
    return first;
};

proto.valueOf = function (forceAppend) {
    let fragment = this._;
    const noFragment = fragment == null;
    if (noFragment)
        fragment = (this._ = this.ownerDocument.createDocumentFragment());
    if (noFragment || forceAppend) {
        const n = this.childNodes;
        let i = 0;
        const l = n.length;
        for (; i < l; i++)
            fragment.appendChild(n[i]);
    }
    return fragment;
};

export function Wire(childNodes) {
    const nodes = (this.childNodes = slice.call(childNodes, 0));
    this.firstChild = nodes[0];
    this.lastChild = nodes[nodes.length - 1];
    this.ownerDocument = nodes[0].ownerDocument;
    this._ = null;
}

