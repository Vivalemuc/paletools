import styles from "./styles.css";
import UTLabelWithToggleControl from "../../controls/UTLabelWithToggleControl";
import settings, { saveConfiguration } from "../../settings";
import { addStyle, removeStyle } from "../../utils/styles";

export default function runGridMode(){

    const option = new UTLabelWithToggleControl();

    option.setLabel("Grid Mode");
    option.onToggle = (elem, eventType, value) => {
        if(value.toggleState){
            addStyle('paletools-grid', styles);
        }
        else {
            removeStyle('paletools-grid');
        }
        settings.palegrid.enabled = value.toggleState;
        saveConfiguration();
    };

    if(settings.palegrid.enabled){
        addStyle('paletools-grid', styles);
    }

    option.toggle();

    option.getRootElement().style.float = "right";
    $(option.getRootElement()).insertBefore(".ut-fifa-header-view .eaSports");
}