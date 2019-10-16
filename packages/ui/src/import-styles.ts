export function importStyle(text: string, label: string = '') {
    const style = document.createElement('style');
    style.textContent = text;
    if (label) {
        style.setAttribute('target', label);
    }
    document.head.appendChild(style);
}