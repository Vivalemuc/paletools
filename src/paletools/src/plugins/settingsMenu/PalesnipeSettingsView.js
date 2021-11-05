import UTLabelWithTextInputControl from "../../controls/UTLabelWithTextInputControl";
import UTLabelWithToggleControl from "../../controls/UTLabelWithToggleControl";
import settings, { saveConfiguration } from "../../settings";

const PalesnipeSettingsView = function (t) {
    UTView.call(this);
}

JSUtils.inherits(PalesnipeSettingsView, UTView);

PalesnipeSettingsView.prototype._generate = function _generate() {
    let self = this;
    function addLabelWithInput(container, label, inputId) {
        const labelWithInput = new UTLabelWithTextInputControl();
        labelWithInput.setLabel(label);
        labelWithInput.setInputId(`palesnipe-settings-${inputId.replace(/\./g, "-")}`);

        let buttonValue = settings.palesnipe;
        for (let level of inputId.split('.')) {
            buttonValue = buttonValue[level];
        }

        labelWithInput.setInputValue(buttonValue);
        labelWithInput.onInputChange(self.handleInputChange);
        container.appendChild(labelWithInput.getRootElement());
    }

    function addLabelWithToggle(container, label, toggleId) {
        const labelWithToggle = new UTLabelWithToggleControl();
        labelWithToggle.setLabel(label);
        labelWithToggle.setToggleId(`palesnipe-settings-${toggleId.replace(/\./g, "-")}`);

        let buttonValue = settings.palesnipe;
        for (let level of toggleId.split('.')) {
            buttonValue = buttonValue[level];
        }

        if (buttonValue) {
            labelWithToggle.toggle();
        }

        labelWithToggle.onToggle = self.handleToggleChange;
        container.appendChild(labelWithToggle.getRootElement());
    }

    if (!this.generated) {
        let container = document.createElement("div");
        container.classList.add("ut-market-search-filters-view");
        container.classList.add("floating");
        container.style["overflow-y"] = "scroll";
        container.style["display"] = "flex";
        container.style["align-items"] = "center";

        let contentContainer = document.createElement("div");
        contentContainer.style["height"] = "100%";
        contentContainer.classList.add("ut-pinned-list-container");
        container.appendChild(contentContainer);
        let content = document.createElement("div");
        content.classList.add("palesnipe-settings-wrapper");
        content.classList.add("ut-pinned-list");
        contentContainer.appendChild(content);

        let visibilitySettingsContainer = document.createElement("div");

        addLabelWithToggle(visibilitySettingsContainer, "Display Saved Filters", "plugins.savedFilters");
        addLabelWithToggle(visibilitySettingsContainer, "Display Player Id Filter", "plugins.playerIdFilter");
        addLabelWithToggle(visibilitySettingsContainer, "Display Player Rating Filter", "plugins.playerRatingFilter");
        addLabelWithToggle(visibilitySettingsContainer, "Display Player Id on search results", "plugins.playerIdValue");
        addLabelWithToggle(visibilitySettingsContainer, "Display Min & Max Prices on compare", "plugins.minMaxPrices");
        addLabelWithToggle(visibilitySettingsContainer, "Display FUTBIN search", "plugins.futbinSearch");

        let keyAssignmentsContainer = document.createElement("div");

        let generalContainer = document.createElement("div");
        addLabelWithInput(generalContainer, "Enable / Disable Palesnipe", "buttons.enableDisable");
        addLabelWithToggle(generalContainer, "Auto press ENTER after buy", "buttons.results.pressEnter");
        addLabelWithToggle(generalContainer, "BOT Mode", "buttons.search.enableBotMode");

        let searchContainer = document.createElement("div");
        addLabelWithInput(searchContainer, "Go back", "buttons.back");
        addLabelWithInput(searchContainer, "Search", "buttons.search.search");
        addLabelWithInput(searchContainer, "Buy now", "buttons.results.buy");
        addLabelWithInput(searchContainer, "Reset bid", "buttons.search.resetBid");
        addLabelWithInput(searchContainer, "Bid", "buttons.results.bid");
        addLabelWithInput(searchContainer, "Send item to transfer list", "buttons.results.transfer");
        addLabelWithInput(searchContainer, "Send item to club", "buttons.results.club");
        addLabelWithInput(searchContainer, "Quick sell item", "buttons.results.sell");
        addLabelWithInput(searchContainer, "Select previous player in lists", "buttons.lists.up");
        addLabelWithInput(searchContainer, "Select next player in lists", "buttons.lists.down");
        addLabelWithInput(searchContainer, "Go to previous page", "buttons.lists.prev");
        addLabelWithInput(searchContainer, "Go to next page", "buttons.lists.next");
        // add autopress enter setting

        let bidContainer = document.createElement("div");
        addLabelWithInput(bidContainer, "Decrease min bid value", "buttons.search.decMinBid");
        addLabelWithInput(bidContainer, "Increase min bid value", "buttons.search.incMinBid");
        addLabelWithInput(bidContainer, "Decrease max bid value", "buttons.search.decMaxBid");
        addLabelWithInput(bidContainer, "Increase max bid value", "buttons.search.incMaxBid");
        addLabelWithInput(bidContainer, "Decrease min buy now value", "buttons.search.decMinBuy");
        addLabelWithInput(bidContainer, "Increase min buy now value", "buttons.search.incMinBuy");
        addLabelWithInput(bidContainer, "Decrease max buy now value", "buttons.search.decMaxBuy");
        addLabelWithInput(bidContainer, "Increase max buy now value", "buttons.search.incMaxBuy");
        addLabelWithInput(bidContainer, "Bot mode, increment min bid", "buttons.search.botModeMinBid");
        addLabelWithInput(bidContainer, "Bot mode, increment min buy now", "buttons.search.botModeMinBuy");

        // add toggle bot mode
        content.appendChild(keyAssignmentsContainer);

        keyAssignmentsContainer.appendChild(generalContainer);
        keyAssignmentsContainer.appendChild(searchContainer);
        keyAssignmentsContainer.appendChild(bidContainer);

        this.__root = container;
        this.generated = true;
    }
}

PalesnipeSettingsView.prototype.handleInputChange = function (elem, code) {
    let path = elem.id.replace("palesnipe-settings-", "").replace(/-/g, ".");
    setObjectPropertyByPath(settings.palesnipe, path, code);
    elem.value = code;
    saveConfiguration();
}

PalesnipeSettingsView.prototype.handleToggleChange = function (elem, eventType, value) {
    let path = elem.getRootElement().id.replace("palesnipe-settings-", "").replace(/-/g, ".");
    setObjectPropertyByPath(settings.palesnipe, path, value.toggleState);
    saveConfiguration();
}

export default PalesnipeSettingsView;