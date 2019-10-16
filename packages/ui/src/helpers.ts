export function foreach(items, action) {
    if (!items)
        return '';
    return items.map(action);
}