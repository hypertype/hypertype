// utils
import {createContent} from '../../create-content';
import importNode from '../../import-node';
import {sanitize} from '../../domsanitizer';
// local
import {find, parse} from './walker.js';


const parsed = new WeakMap();
const referenced = new WeakMap();

function createInfo(options, template) {
    let markup = (options.convert || sanitize)(template);
    const transform = options.transform;
    if (transform)
        markup = transform(markup);
    const content = createContent(markup, options.type);
    cleanContent(content);
    const holes = [];
    parse(content, holes, template.slice(0), []);
    const info = {
        content: content,
        updates: function (content) {
            const updates = [];
            let len = holes.length;
            let i = 0;
            let off = 0;
            while (i < len) {
                const info = holes[i++];
                const node = find(content, info.path);
                switch (info.type) {
                    case 'any':
                        updates.push({fn: options.any(node, []), sparse: false});
                        break;
                    case 'attr':
                        const sparse = info.sparse;
                        const fn = options.attribute(node, info.name, info.node);
                        if (sparse === null)
                            updates.push({fn: fn, sparse: false});
                        else {
                            off += sparse.length - 2;
                            updates.push({fn: fn, sparse: true, values: sparse});
                        }
                        break;
                    case 'text':
                        updates.push({fn: options.text(node), sparse: false});
                        node.textContent = '';
                        break;
                }
            }
            len += off;
            return function () {
                const length = arguments.length;
                if (len !== (length - 1)) {
                    throw new Error(
                        (length - 1) + ' values instead of ' + len + '\n' +
                        template.join('${value}')
                    );
                }
                let i = 1;
                let off = 1;
                while (i < length) {
                    const update = updates[i - off];
                    if (update.sparse) {
                        const values = update.values;
                        let value = values[0];
                        let j = 1;
                        const l = values.length;
                        off += l - 2;
                        while (j < l)
                            value += arguments[i++] + values[j++];
                        update.fn(value);
                    } else
                        update.fn(arguments[i++]);
                }
                return content;
            };
        }
    };
    parsed.set(template, info);
    return info;
}

function createDetails(options, template) {
    const info = parsed.get(template) || createInfo(options, template);
    const content = importNode.call(document, info.content, true);
    const details = {
        content: content,
        template: template,
        updates: info.updates(content)
    };
    referenced.set(options, details);
    return details;
}

export function domtagger(options) {
    return function (template) {
        let details = referenced.get(options);
        if (details == null || details.template !== template)
            details = createDetails(options, template);
        details.updates.apply(null, arguments);
        return details.content;
    };
}

function cleanContent(fragment) {
    const childNodes = fragment.childNodes;
    let i = childNodes.length;
    while (i--) {
        const child = childNodes[i];
        if (
            child.nodeType !== 1 &&
            child.textContent.trim().length === 0
        ) {
            fragment.removeChild(child);
        }
    }
}
