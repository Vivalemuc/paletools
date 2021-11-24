let plugin;
/// #if process.env.SELECT_CHEAPEST
import { addLabelWithToggle } from "../controls";
import UTMarketSearchResultsSplitViewControllerHelpers from "../helpers/UTMarketSearchResultsSplitViewControllerHelpers";
import settings, { saveConfiguration } from "../settings";
import getCurrentController from "../utils/controller";

const cfg = settings.plugins.selectCheapest;

function run() {
    const UTMarketSearchResultsSplitViewController_eListDataChanged = UTMarketSearchResultsSplitViewController.prototype._eListDataChanged;
    UTMarketSearchResultsSplitViewController.prototype._eListDataChanged = function _eListDataChanged(e, t) {
        UTMarketSearchResultsSplitViewController_eListDataChanged.call(this, e, t);
        if(!settings.enabled || !cfg.enabled) return;

        let itemsData = t.items;
        if(itemsData.length === 0) return;

        let minBuyNow = Number.MAX_VALUE;
        let selectedIndex;
        for (let itemIndex = 0; itemIndex < itemsData.length; itemIndex++) {
            let itemData = itemsData[itemIndex];
            const auction = itemData._auction;
            if (auction.buyNowPrice < minBuyNow) {
                minBuyNow = auction.buyNowPrice;
                selectedIndex = itemIndex;
            }
        }

        if (selectedIndex) {
            UTMarketSearchResultsSplitViewControllerHelpers.selectListItemByIndex(selectedIndex);
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
    order: 100,
    settings: {
        name: 'select-cheapest',
        title: 'plugins.selectCheapest.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;