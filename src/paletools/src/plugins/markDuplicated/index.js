
let plugin;

/// #if process.env.MARK_DUPLICATED
import styles from "./styles.css";
import settings from "../../settings";
import { addStyle, removeStyle } from "../../utils/styles";
import { EVENTS, on } from "../../events";
import { addLabelWithToggle } from "../../controls";
import { getAllClubPlayers } from "../../services/club";
import getCurrentController from "../../utils/controller";
import UTMarketSearchResultsSplitViewControllerHelpers from "../../helpers/UTMarketSearchResultsSplitViewControllerHelpers";
import { updateBanner } from "../../utils/banner";
import localize from "../../localization";
const cfg = settings.plugins.markDuplicated;

function run() {
    let club = [];

    const UTTransfersHubViewController_requestTransferTargetData = UTTransfersHubViewController.prototype._requestTransferTargetData;

    UTTransfersHubViewController.prototype._requestTransferTargetData = function () {
        if (settings.enabled && cfg.enabled) {
            getAllClubPlayers(true, null, (loadedPlayersCount, currentClub) => {
                club = currentClub;
                updateBanner(localize("plugins.markDuplicated.loading").replace("{count}", loadedPlayersCount));

            }).then(club => {
                club = club;
                updateBanner("");
            });
        }

        UTTransfersHubViewController_requestTransferTargetData.call(this);
    };

    const UTItemTableCellView_render = UTItemTableCellView.prototype.render;
    UTItemTableCellView.prototype.render = function (e) {
        UTItemTableCellView_render.call(this, e);

        if (settings.enabled && cfg.enabled) {
            if (this.data.duplicateId) {
                $(this.__entityContainer).addClass("club-duplicated");
            } else {
                const controller = getCurrentController();
                if (controller instanceof UTMarketSearchResultsSplitViewController) {
                    if (club.find(x => x.definitionId === this.data.definitionId)) {
                        $(this.__entityContainer).addClass("club-duplicated");
                    }
                }
            }
        }
    }

    on(EVENTS.APP_ENABLED, () => addStyle("paletools-markDuplicated", styles));
    on(EVENTS.APP_DISABLED, () => removeStyle("paletools-markDuplicated"));
}

if (settings.enabled && cfg.enabled) {
    addStyle("paletools-markDuplicated", styles);
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
        name: 'mark-duplicated',
        title: 'plugins.markDuplicated.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;