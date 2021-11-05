export function on(eventName, callback) {
    window.addEventListener(eventName, callback);
}

export function triggerEvent(eventName, data) {
    window.dispatchEvent(new CustomEvent(eventName, { bubbles: true, detail: data }));
}