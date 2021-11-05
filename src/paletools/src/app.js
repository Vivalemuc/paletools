import settings from "./settings";
import { triggerEvent } from "./events";

export default function enableDisableApp() {
    if (settings.enabled) {
        disableApp();
    }
    else {
        enableApp();
    }
}

function enableApp() {
    settings.enabled = true;
    notifySuccess("Palesnipe Enabled");
    triggerEvent("appEnabled");
}

function disableApp() {
    settings.enabled = false;
    notifyNeutral("Palesnipe Disabled");
    triggerEvent("appDisabled");
}