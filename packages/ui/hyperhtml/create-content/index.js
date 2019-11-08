/*! (c) Andrea Giammarchi - ISC */
const FRAGMENT = 'fragment';
const TEMPLATE = 'template';
const HAS_CONTENT = 'content' in create(TEMPLATE);

const createHTML = HAS_CONTENT ?
    function (html) {
        const template = create(TEMPLATE);
        template.innerHTML = html;
        return template.content;
    } :
    function (html) {
        const content = create(FRAGMENT);
        const template = create(TEMPLATE);
        let childNodes = null;
        if (/^[^\S]*?<(col(?:group)?|t(?:head|body|foot|r|d|h))/i.test(html)) {
            const selector = RegExp.$1;
            template.innerHTML = '<table>' + html + '</table>';
            childNodes = template.querySelectorAll(selector);
        } else {
            template.innerHTML = html;
            childNodes = template.childNodes;
        }
        append(content, childNodes);
        return content;
    };

export function createContent(markup, type) {
    return (type === 'svg' ? createSVG : createHTML)(markup);
}

function append(root, childNodes) {
    let length = childNodes.length;
    while (length--)
        root.appendChild(childNodes[0]);
}

function create(element) {
    return element === FRAGMENT ?
        document.createDocumentFragment() :
        document.createElementNS('http://www.w3.org/1999/xhtml', element);
}

// it could use createElementNS when hasNode is there
// but this fallback is equally fast and easier to maintain
// it is also battle tested already in all IE
function createSVG(svg) {
    const content = create(FRAGMENT);
    const template = create('div');
    template.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg">' + svg + '</svg>';
    append(content, template.firstChild.childNodes);
    return content;
}

