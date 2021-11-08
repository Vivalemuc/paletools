export function addStyle(id, css) {
    let styles = document.getElementById(id);
    if (styles) {
        styles.textContent = css;
    }
    else {
        styles = document.createElement("style");
        styles.textContent = css;
        styles.id = id;
        document.body.appendChild(styles);
    }
}

export function removeStyle(id) {
    const elem = document.getElementById(id);
    if (elem) {
        document.body.removeChild(elem);
    }
}