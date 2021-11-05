import settings from "../../settings";
import { copyToClipboard } from "../../utils/clipboard";

const copyPlayerIdAction = {
    generate: (instance, buttonsContainerFunc) => {
        if (settings.palesnipe.plugins.playerIdFilter) {
            instance._copyPlayerIdButton = new UTGroupButtonControl();
            instance._copyPlayerIdButton.init();
            instance._copyPlayerIdButton.setText("Copy player ID to clipboard");
            instance._copyPlayerIdButton.addTarget(instance, () => instance.onCopyPlayerId.notify(), EventType.TAP);
            instance._copyPlayerIdButton.getRootElement().classList.add("palesnipe-element");
            instance.onCopyPlayerId = new EAObservable();
            buttonsContainerFunc(instance).appendChild(instance._copyPlayerIdButton.getRootElement());
        }
    },
    destroyGeneratedElements: (instance) => {
        if (instance._copyPlayerIdButton) {
            instance._copyPlayerIdButton.destroy();
        }
    },
    dealloc: (instance) => {
        if (instance.onCopyPlayerId) {
            instance.onCopyPlayerId.dealloc();
        }
    },
    attachEvent: (instance) => {
        if (instance._panel.onCopyPlayerId) {
            instance._panel.onCopyPlayerId.observe(instance, instance._onCopyPlayerId);
        }
    },
    
    createEvent: (proto) => {
        proto._onCopyPlayerId = function () {
            copyToClipboard(this._viewmodel.current().definitionId);
            notifySuccess("Player ID copied to clipboard!");
        }
    }
}

export default copyPlayerIdAction;