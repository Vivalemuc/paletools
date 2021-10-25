export function dispatchMouseEvent(target, eventName) {
    if (!(target instanceof HTMLElement)) {
        if (target.length === 0) return false;
        target = target[0];
    }

    const mouseEvent = new MouseEvent(eventName, {
        bubbles: true,
        cancelable: true,
        view: window
    });
    target.dispatchEvent(mouseEvent);
    return true;
}

export function mouseDown(target){
    return dispatchMouseEvent(target, 'mousedown');
}

export function mouseUp(target){
    return dispatchMouseEvent(target, 'mouseup');
}

export default function mouseClick(target, delay){
    if (delay) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve(mouseClick(target));
            }, delay);
        });
    }
    else {
        return mouseDown(target) && mouseUp(target);
    }
}