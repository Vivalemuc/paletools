export function addStyle(id, css){
    const styles = document.createElement("style");
    styles.textContent = css;
    styles.id = id;
    document.body.appendChild(styles);
}

export function removeStyle(id){
    document.removeChild(document.getElementById(id));
}