/*! (c) Andrea Giammarchi - ISC */
const importNode = (function (
    document,
    appendChild,
    cloneNode,
    createTextNode,
    importNode
) {
    const native = importNode in document;
    // IE 11 has problems with cloning templates:
    // it "forgets" empty childNodes. This feature-detects that.
    const fragment = document.createDocumentFragment();
    fragment[appendChild](document[createTextNode]('g'));
    fragment[appendChild](document[createTextNode](''));
    const content = native ?
        document[importNode](fragment, true) :
        fragment[cloneNode](true);
    return content.childNodes.length < 2 ?
        function importNode(node, deep) {
            const clone = node[cloneNode]();
            const childNodes = node.childNodes || [],
                length = childNodes.length;
            let i = 0;
            for (; deep && i < length; i++
            ) {
                clone[appendChild](importNode(childNodes[i], deep));
            }
            return clone;
        } :
        (native ?
                document[importNode] :
                function (node, deep) {
                    return node[cloneNode](!!deep);
                }
        );
}(
    document,
    'appendChild',
    'cloneNode',
    'createTextNode',
    'importNode'
));
export default importNode;
