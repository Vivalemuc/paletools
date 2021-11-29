import UTLabelWithTextInputWithKeyPressControl from "./UTLabelWithTextInputWithKeyPressControl";
import UTLabelWithToggleControl from "./UTLabelWithToggleControl";
import localize from "../localization";
import UTLabelWithLinkControl from "./UTLabelWithLinkControl";
import UTLabelWithTextInputControl from "./UTLabelWithTextInputControl";

export function addLabelWithTextInputWithKeyPress(container, labelLocaleKey, defaultValue, onInputChange, inputId) {
    const labelWithInput = new UTLabelWithTextInputWithKeyPressControl();
    labelWithInput.setLabel(localize(labelLocaleKey));
    if(inputId){
        labelWithInput.setInputId(inputId);
    }

    labelWithInput.setInputValue(defaultValue);
    labelWithInput.onInputChange(onInputChange);
    container.appendChild(labelWithInput.getRootElement());
}

export function addLabelWithTextInput(container, lableLocaleKey, onKeyDown){
    const labelWithInput = new UTLabelWithTextInputControl();
    labelWithInput.setLabel(localize(lableLocaleKey));
    labelWithInput.onKeyDown(onKeyDown);
    container.appendChild(labelWithInput.getRootElement());
}

export function addLabelWithLink(container, labelLocaleKey, linkLocaleKey, linkUrl) {
    const labelWithLink = new UTLabelWithLinkControl();
    labelWithLink.setLabel(localize(labelLocaleKey));
    labelWithLink.setLinkText(localize(linkLocaleKey));
    labelWithLink.setLinkUrl(linkUrl);
    container.appendChild(labelWithLink.getRootElement());
}

export function addLabelWithToggle(container, labelLocaleKey, toggled, onToggleChange, toggleId) {
    const labelWithToggle = new UTLabelWithToggleControl();
    labelWithToggle.setLabel(localize(labelLocaleKey));
    if(toggleId){
        labelWithToggle.setToggleId(toggleId);
    }

    if (toggled) {
        labelWithToggle.toggle();
    }

    labelWithToggle.onToggle = (elem, eventType, value) => {
        if(onToggleChange){
            const returnValue = (onToggleChange)(value.toggleState);
            if(returnValue === false){
                labelWithToggle.toggle(false);
            }
        }
    } ;

    container.appendChild(labelWithToggle.getRootElement());
}