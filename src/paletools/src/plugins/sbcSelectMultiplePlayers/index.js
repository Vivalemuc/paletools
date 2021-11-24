

let plugin;
/// #if process.env.SBC_SELECT_MULTIPLE_PLAYERS
import getCurrentController from "../../utils/controller";
import settings from "../../settings";
import { EVENTS, on } from "../../events";
import { addLabelWithToggle } from "../../controls";

const cfg = settings.plugins.sbcSelectMultiplePlayers;

function run() {
    let checkedPlayers = {};

    const UTItemTableCellView_render = UTItemTableCellView.prototype.render;
    UTItemTableCellView.prototype.render = function (e) {
        const self = this;
        UTItemTableCellView_render.call(this, e);

        const controller = getCurrentController();
        if (settings.enabled && cfg.enabled && controller instanceof UTSBCSquadSplitViewController) {
            function addCheckbox() {
                if(!self.data) return;

                if (!self._selectMultiplePlayersCheckbox) {
                    self._selectMultiplePlayersCheckbox = document.createElement("input");
                    self._selectMultiplePlayersCheckbox.classList.add("select-multiple-players");
                    self._selectMultiplePlayersCheckbox.type = "checkbox";
                    self._selectMultiplePlayersCheckbox.addEventListener("change", (ev) => {
                        if (self._selectMultiplePlayersCheckbox.checked) {
                            checkedPlayers[self.data.definitionId] = self.data;
                            $(self.__entityContainer).attr("data-select-multiple-players-checked", "");
                        }
                        else {
                            delete checkedPlayers[self.data.definitionId];
                            $(self.__entityContainer).removeAttr("data-select-multiple-players-checked");
                        }

                        ev.stopPropagation();
                    });

                    if ($(self.__entityContainer).is("[data-select-multiple-players-checked]")) {
                        self._selectMultiplePlayersCheckbox.checked = true;
                    }

                    $(self.__entityContainer).append(self._selectMultiplePlayersCheckbox);
                }
            }

            function removeCheckbox() {
                $(self.__entityContainer, ".select-multiple-players").remove();
                self._selectMultiplePlayersCheckbox = null;
            }

            addCheckbox();

            on(EVENTS.APP_ENABLED, addCheckbox);
            on(EVENTS.APP_DISABLED, removeCheckbox);
        }
    }
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });
    return container;
}

plugin = {
    run: run,
    order: 10,
    settings: {
        name: 'sbc-select-multiple-players',
        title: 'plugins.sbcSelectMultiplePlayers.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;