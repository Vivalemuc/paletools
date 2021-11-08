import UTLabelWithTextInputControl from "./UTLabelWithTextInputControl";
import UTLabelWithToggleControl from "./UTLabelWithToggleControl";
import localize from "../localization";

export function addLabelWithInput(container, labelLocaleKey, defaultValue, onInputChange, inputId) {
    const labelWithInput = new UTLabelWithTextInputControl();
    labelWithInput.setLabel(localize(labelLocaleKey));
    if(inputId){
        labelWithInput.setInputId(inputId);
    }

    labelWithInput.setInputValue(defaultValue);
    labelWithInput.onInputChange(onInputChange);
    container.appendChild(labelWithInput.getRootElement());
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
            (onToggleChange)(value.toggleState);
        }
    } ;

    container.appendChild(labelWithToggle.getRootElement());
}