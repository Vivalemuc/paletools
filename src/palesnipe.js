(function (buttons) {
    const VERSION = "v3.1.0";

    buttons = $.extend({
        back: 'Digit1',
        enableDisable: 'Comma',
        lists: {
            up: 'ArrowUp',
            down: 'ArrowDown',
            prev: 'ArrowLeft',
            next: 'ArrowRight',
        },
        search: {
            resetBid: 'Backquote',
            decMinBid: 'ArrowLeft',
            incMinBid: 'ArrowRight',
            decMaxBid: 'End',
            incMaxBid: 'Home',
            decMinBuy: 'Delete',
            incMinBuy: 'PageDown',
            decMaxBuy: 'ArrowDown',
            incMaxBuy: 'ArrowUp',
            search: 'Digit2',
            botModeMinBid: 'BracketRight',
            botModeMinBuy: 'BracketLeft',
            enableBotMode: false
        },
        results: {
            bid: 'Digit4',
            buy: 'Digit3',
            transfer: 'KeyR',
            club: 'KeyC',
            pressEnter: true,
            autoBuy: false,
            preventBack: false,
            sell: 'KeyQ',
            decBid: 'Delete',
            incBid: 'PageDown'
        }
    }, buttons || {});
    if(window.__palesnipeActive) return;
    window.__palesnipeActive = true;


    let _enabled = true;
    let _appStyles = document.createElement("style");

    let _palesnipeSettings = {
        appVersion: VERSION,
        gridMode: false,
        buttons: buttons
    };

    if (localStorage.getItem("palesnipe:settings")) {
        _palesnipeSettings = JSON.parse(atob(localStorage.getItem("palesnipe:settings")));
    }

    function copyToClipboard(str) {
        const el = document.createElement('textarea');
        el.value = str;
        el.setAttribute('readonly', '');
        el.style.position = 'absolute';
        el.style.left = '-9999px';
        document.body.appendChild(el);
        el.select();
        document.execCommand('copy');
        document.body.removeChild(el);
    }

    function saveConfiguration() {
        localStorage.setItem("palesnipe:settings", btoa(JSON.stringify(_palesnipeSettings)));
        resetCss();
    }

    function setObjectPropertyByPath(obj, path, value) {
        var schema = obj;
        var pList = path.split('.');
        var len = pList.length;
        for (var i = 0; i < len - 1; i++) {
            var elem = pList[i];
            if (!schema[elem]) schema[elem] = {}
            schema = schema[elem];
        }

        schema[pList[len - 1]] = value;
    }

    // reset console
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    window.console = iframe.contentWindow.console;

    window.MAX_NEW_ITEMS = Number.MAX_VALUE;

    const getCurrentController = () => getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();

    //$(".ut-fifa-header-view").append(`<button id="throw">DEBUG</button>`);

    $("#throw").click(function () {
        throw new Error("debug error");
    });

    const UTLabelControl = function (t) {
        UTControl.call(this);
    }

    UTLabelControl.prototype._generate = function _generate() {
        if (!this.generated) {
            this._label = document.createElement("label");
            this.__root = this._label;
            this.generated = true;
        }
    }

    UTLabelControl.prototype.setText = function (text) {
        this._label.textContent = text;
    }

    UTLabelControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        $(this.__root).remove();
        this.__root = null;
    }

    UTLabelControl.prototype.getRootElement = function () {
        return this.__root;
    }

    const UTLabelWithTextInputControl = function (t) {
        UTControl.call(this);
    }

    UTLabelWithTextInputControl.prototype._generate = function _generate() {
        if (!this.generated) {
            const container = document.createElement("div");

            this._label = new UTLabelControl();
            this._input = new UTTextInputControl();

            container.appendChild(this._label.getRootElement());
            container.appendChild(this._input.getRootElement());

            this._onInputChangeCallbacks = [];

            let self = this;

            $(this._input.getRootElement()).keydown(function (e) {
                e.preventDefault();
                e.stopImmediatePropagation();
                e.stopPropagation();

                for (let callback of self._onInputChangeCallbacks) {
                    (callback)(this, e.originalEvent.code);
                }
                return false;
            });

            this.__root = container;
            this.generated = true;
        }
    }

    UTLabelWithTextInputControl.prototype.setLabel = function (text) {
        this._label.setText(text);
    }

    UTLabelWithTextInputControl.prototype.setInputId = function (value) {
        this._input.getRootElement().id = value;
    }

    UTLabelWithTextInputControl.prototype.setInputValue = function (value) {
        this._input.setValue(value);
    }

    UTLabelWithTextInputControl.prototype.onInputChange = function (callback) {
        this._onInputChangeCallbacks.push(callback);
    }

    UTLabelWithTextInputControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        $(this.__root).remove();
        this.__root = null;
    }

    UTLabelWithTextInputControl.prototype.getRootElement = function () {
        return this.__root;
    }

    const UTLabelWithToggleControl = function (t) {
        UTControl.call(this);
    }

    UTLabelWithToggleControl.prototype._generate = function _generate() {
        if (!this.generated) {
            const container = document.createElement("div");

            this._label = new UTLabelControl();
            this._toggle = new UTToggleControl();

            container.appendChild(this._label.getRootElement());
            container.appendChild(this._toggle.getRootElement());

            this._toggle.init();
            this._toggle.addTarget(this, this._onToggled, EventType.TAP);
            

            this.__root = container;
            this.generated = true;
        }
    }

    UTLabelWithToggleControl.prototype.setLabel = function (text) {
        this._label.setText(text);
    }

    UTLabelWithToggleControl.prototype.setToggleId = function (value) {
        this._toggle.getRootElement().id = value;
    }

    UTLabelWithToggleControl.prototype.toggle = function () {
        this._toggle.toggle();
    }

    UTLabelWithToggleControl.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        $(this.__root).remove();
        this.__root = null;
    }

    UTLabelWithToggleControl.prototype._onToggled = function(elem, eventType, value){
        if(this.onToggle){
            (this.onToggle)(elem, eventType, value);
        }
    }

    UTLabelWithToggleControl.prototype.getRootElement = function () {
        return this.__root;
    }

    const PalesnipeSettingsView = function (t) {
        UTView.call(this);
    }

    JSUtils.inherits(PalesnipeSettingsView, UTView);

    PalesnipeSettingsView.prototype._generate = function _generate() {
        let self = this;
        function addLabelWithInput(container, label, inputId) {
            const labelWithInput = new UTLabelWithTextInputControl();
            labelWithInput.setLabel(label);
            labelWithInput.setInputId(`palesnipe-buttons-${inputId.replace(/\./g, "-")}`);

            let buttonValue = _palesnipeSettings.buttons;
            for (let level of inputId.split('.')) {
                buttonValue = buttonValue[level];
            }

            labelWithInput.setInputValue(buttonValue);
            labelWithInput.onInputChange(self.handleInputChange);
            container.appendChild(labelWithInput.getRootElement());
        }

        function addLabelWithToggle(container, label, toggleId){
            const labelWithToggle = new UTLabelWithToggleControl();
            labelWithToggle.setLabel(label);
            labelWithToggle.setToggleId(`palesnipe-buttons-${toggleId.replace(/\./g, "-")}`);

            let buttonValue = _palesnipeSettings.buttons;
            for (let level of toggleId.split('.')) {
                buttonValue = buttonValue[level];
            }

            if(buttonValue){
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

            let generalContainer = document.createElement("div");
            addLabelWithInput(generalContainer, "Enable / Disable Palesnipe", "enableDisable");
            addLabelWithToggle(generalContainer, "Auto press ENTER after buy", "results.pressEnter");
            addLabelWithToggle(generalContainer, "BOT Mode", "search.enableBotMode");

            let searchContainer = document.createElement("div");
            addLabelWithInput(searchContainer, "Go back", "back");
            addLabelWithInput(searchContainer, "Search", "search.search");
            addLabelWithInput(searchContainer, "Buy now", "results.buy");
            addLabelWithInput(searchContainer, "Reset bid", "search.resetBid");
            addLabelWithInput(searchContainer, "Bid", "results.bid");
            addLabelWithInput(searchContainer, "Send item to transfer list", "results.transfer");
            addLabelWithInput(searchContainer, "Send item to club", "results.club");
            addLabelWithInput(searchContainer, "Quick sell item", "results.sell");
            addLabelWithInput(searchContainer, "Select previous player in lists", "lists.up");
            addLabelWithInput(searchContainer, "Select next player in lists", "lists.down");
            addLabelWithInput(searchContainer, "Go to previous page", "lists.prev");
            addLabelWithInput(searchContainer, "Go to next page", "lists.next");
            // add autopress enter setting

            let bidContainer = document.createElement("div");
            addLabelWithInput(bidContainer, "Decrease min bid value", "search.decMinBid");
            addLabelWithInput(bidContainer, "Increase min bid value", "search.incMinBid");
            addLabelWithInput(bidContainer, "Decrease max bid value", "search.decMaxBid");
            addLabelWithInput(bidContainer, "Increase max bid value", "search.incMaxBid");
            addLabelWithInput(bidContainer, "Decrease min buy now value", "search.decMinBuy");
            addLabelWithInput(bidContainer, "Increase min buy now value", "search.incMinBuy");
            addLabelWithInput(bidContainer, "Decrease max buy now value", "search.decMaxBuy");
            addLabelWithInput(bidContainer, "Increase max buy now value", "search.incMaxBuy");
            addLabelWithInput(bidContainer, "Bot mode, increment min bid", "search.botModeMinBid");
            addLabelWithInput(bidContainer, "Bot mode, increment min buy now", "search.botModeMinBuy");

            // add toggle bot mode

            content.appendChild(generalContainer);
            content.appendChild(searchContainer);
            content.appendChild(bidContainer);

            this.__root = container;
            this.generated = true;
        }
    }

    PalesnipeSettingsView.prototype.handleInputChange = function (elem, code) {
        let path = elem.id.replace("palesnipe-buttons-", "").replace(/-/g, ".");
        setObjectPropertyByPath(_palesnipeSettings.buttons, path, code);
        elem.value = code;
        saveConfiguration();
    }

    PalesnipeSettingsView.prototype.handleToggleChange = function (elem, eventType, value) {
        let path = elem.getRootElement().id.replace("palesnipe-buttons-", "").replace(/-/g, ".");
        setObjectPropertyByPath(_palesnipeSettings.buttons, path, value.toggleState);
        saveConfiguration();
    }

    const PalesnipeSettingsController = function (t) {
        UTViewController.call(this);
    };

    JSUtils.inherits(PalesnipeSettingsController, UTViewController);

    PalesnipeSettingsController.prototype._getViewInstanceFromData = function () {
        return new PalesnipeSettingsView();
    }

    PalesnipeSettingsController.prototype.viewDidAppear = function () {
        this.getNavigationController().setNavigationVisibility(true, true);
    }

    PalesnipeSettingsController.prototype.getNavigationTitle = function () {
        return "Palesnipe Settings";
    }


    const UTMarketSearchFiltersView__generate = UTMarketSearchFiltersView.prototype._generate
    UTMarketSearchFiltersView.prototype._generate = function _generate() {
        function createContainer(child) {
            const container = document.createElement("div");
            container.classList.add("inline-list-select");
            container.classList.add("ut-player-search-control");
            const inlineContainer = document.createElement("div")
            inlineContainer.classList.add("inline-container");
            container.appendChild(inlineContainer);
            const inlineInlineContainer = document.createElement("div");
            inlineContainer.appendChild(inlineInlineContainer);
            inlineInlineContainer.classList.add("ut-player-search-control--input-container");
            inlineInlineContainer.appendChild(child);
            return container;
        }

        UTMarketSearchFiltersView__generate.call(this);
        if (!this._generatePalesnipeCalled) {
            const container = document.createElement("div");
            container.classList.add("ut-item-search-view");
            this._playerId = new UTTextInputControl();
            const playerIdContainer = createContainer(this._playerId.getRootElement());

            this._playerRating = new UTTextInputControl();
            const playerRatingContainer = createContainer(this._playerRating.getRootElement());

            let filtersContainer = document.createElement("div");
            filtersContainer.classList.add("saved-filters");

            this._filterName = new UTTextInputControl();
            this._filterName.init();
            this._filterName.setPlaceholder("Filter name");

            this._saveFilterButton = new UTStandardButtonControl();
            this._saveFilterButton.init();
            this._saveFilterButton.setText("Save");
            this._saveFilterButton.addTarget(this, this.saveFilter, EventType.TAP);

            this._deleteFilterButton = new UTStandardButtonControl();
            this._deleteFilterButton.init();
            this._deleteFilterButton.setText("Delete");
            this._deleteFilterButton.addTarget(this, this.deleteFilter, EventType.TAP);

            this._savedFilters = new UTDropDownControl();
            this._savedFilters.init();
            this._savedFilters.addTarget(this, this.onSavedFiltersChange, EventType.CHANGE);

            $(filtersContainer)
                .append(this._filterName.getRootElement())
                .append(this._saveFilterButton.getRootElement())
                .append(this._deleteFilterButton.getRootElement())
                .append(this._savedFilters.getRootElement());


            $(container)
                .addClass("palesnipe-element")
                .append(filtersContainer)
                .append(playerIdContainer)
                .append(playerRatingContainer);
            $(container).insertBefore($(".ut-item-search-view", this.__root));

            this._playerId.init();
            this._playerId.setPlaceholder("Player ID");
            this._playerId.setMaxLength(25);
            this._playerId.addTarget(this, this.handlePlayerIdChange, EventType.CHANGE);
            this._playerRating.init();
            this._playerRating.setPlaceholder("Player Rating");
            this._playerRating.setMaxLength(3);
            this._playerRating.addTarget(this, this.handlePlayerRatingChange, EventType.CHANGE);

            this.loadSavedFilters();

            this._generatePalesnipeCalled = true;
        }
    }

    UTMarketSearchFiltersView.prototype.getStoredFilters = function () {
        const data = localStorage.getItem("paletools:searchFilters");
        if (!data) return {};
        return JSON.parse(atob(data)) || {};
    }

    UTMarketSearchFiltersView.prototype.saveFilters = function (filters) {
        localStorage.setItem("paletools:searchFilters", btoa(JSON.stringify(filters)));
    }

    UTMarketSearchFiltersView.prototype.loadSavedFilters = function () {
        const searchFilters = this.getStoredFilters();
        let filters = [{ label: '-- Select a filter to load --', value: '' }];
        for (let filterKey of Object.keys(searchFilters).sort()) {
            filters.push({ label: searchFilters[filterKey].name, value: filterKey });
        }
        this._savedFilters.setOptions(filters);
    }

    UTMarketSearchFiltersView.prototype.saveFilter = function () {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            const searchCriteria = controller._viewmodel.searchCriteria;
            const name = this._filterName.getValue();
            const key = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filters = this.getStoredFilters();
            searchCriteria.rating = this._playerRating.getValue();
            filters[key] = { name: name, criteria: searchCriteria };
            this.saveFilters(filters);
            this.loadSavedFilters();
            notifySuccess("Filter saved");
        }
    }

    UTMarketSearchFiltersView.prototype.deleteFilter = function () {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            const filterKey = this._savedFilters.getValue();
            if (!filterKey) return;
            const filters = this.getStoredFilters();
            delete filters[filterKey];
            this.saveFilters(filters);
            this.loadSavedFilters();
            notifySuccess("Filter deleted");
        }
    }

    UTMarketSearchFiltersView.prototype.loadFilter = function (filter) {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            if (filter.criteria.defId && filter.criteria.defId.length > 0) {
                this._playerId.setValue(filter.criteria.defId[0]);
            }
            if (filter.criteria.rating) {
                this._playerRating.setValue(filter.criteria.rating);
            }
            for (let key of Object.keys(filter.criteria)) {
                controller._viewmodel.searchCriteria[key] = filter.criteria[key];
                this.setFilters(controller._viewmodel);
            }
        }
    }

    const UTMarketSearchFiltersView_setFilters = UTMarketSearchFiltersView.prototype.setFilters;
    UTMarketSearchFiltersView.prototype.setFilters = function setFilters(e, t) {
        if (_enabled && e.searchCriteria.defId && e.searchCriteria.defId.length > 0) {
            this._playerId.setValue(e.searchCriteria.defId[0])
        }
        if (_enabled && e.searchCriteria.rating) {
            this._playerRating.setValue(e.searchCriteria.rating);
        }
        UTMarketSearchFiltersView_setFilters.call(this, e, t);
    }

    const UTMarketSearchFiltersView_destroyGeneratedElements = UTMarketSearchFiltersView.prototype.destroyGeneratedElements;
    UTMarketSearchFiltersView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTMarketSearchFiltersView_destroyGeneratedElements.call(this);
        if (this._playerId) {
            this._playerId.destroy();
            this._playerRating.destroy();
            this._filterName.destroy();
            this._saveFilterButton.destroy();
            this._deleteFilterButton.destroy();
            this._savedFilters.destroy();
        }
    }

    UTMarketSearchFiltersView.prototype.handlePlayerIdChange = function (_, __, elem) {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            controller._viewmodel.searchCriteria.defId = [elem.value];
        }
    }

    UTMarketSearchFiltersView.prototype.handlePlayerRatingChange = function (_, __, elem) {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            controller._viewmodel.searchCriteria.rating = elem.value;
        }
    }

    UTMarketSearchFiltersView.prototype.onSavedFiltersChange = function (_, __, elem) {
        const filters = this.getStoredFilters();
        if (filters[elem.value]) {
            this.loadFilter(filters[elem.value]);
        }
        else {
            const controller = getCurrentController();
            if (controller instanceof UTMarketSearchFiltersViewController) {
                controller._eResetSelected();
            }
        }
    }

    const UTMarketSearchFiltersViewController__eResetSelected = UTMarketSearchFiltersViewController.prototype._eResetSelected;
    UTMarketSearchFiltersViewController.prototype._eResetSelected = function _eResetSelected() {
        this.getView()._playerId.clear();
        this.getView()._playerRating.clear();
        this.getView()._filterName.clear();
        UTMarketSearchFiltersViewController__eResetSelected.call(this);
    }

    const UTPaginatedItemListView_setItems = UTPaginatedItemListView.prototype.setItems;
    UTPaginatedItemListView.prototype.setItems = function (e, i) {
        const controller = getCurrentController();
        if (_enabled && controller._listController && controller._listController && controller._listController._searchCriteria) {
            var o = this;
            this.removeListRows();

            e.forEach(function (e) {
                if (shouldRenderItem(e, controller._listController._searchCriteria)) {
                    var t = new UTItemTableCellView;
                    t.setData(e, void 0, void 0, i),
                        o.listRows.push(t)
                }
            });

            return this.listRows;
        }
        else {
            return UTPaginatedItemListView_setItems.call(this, e, i);
        }
    }

    const UTMarketSearchView__generate = UTMarketSearchView.prototype._generate;
    UTMarketSearchView.prototype._generate = function _generate() {
        UTMarketSearchView__generate.call(this);
        if (!this._generatePalesnipeCalled) {
            this._minMaxPriceContainer = document.createElement("div");
            this._minMaxPriceContainer.classList.add("min-max-prices");
            this._minPriceText = document.createElement("span");
            this._minPriceText.classList.add("min-price-value");
            this._maxPriceText = document.createElement("span");
            this._maxPriceText.classList.add("max-price-value");
            const minPriceContainer = document.createElement("span");
            minPriceContainer.classList.add("min-price");
            $(minPriceContainer)
                .append('<span class="min-price-label">Min Buy Now</span>')
                .append(this._minPriceText);
            const maxPriceContainer = document.createElement("span");
            maxPriceContainer.classList.add("max-price");
            $(maxPriceContainer)
                .append('<span class="max-price-label">Max Buy Now</span>')
                .append(this._maxPriceText);


            $(this._minMaxPriceContainer)
                .addClass("palesnipe-element")
                .hide()
                .append(minPriceContainer)
                .append(maxPriceContainer)
                .insertBefore(this._list.getRootElement());

            this._minBuyNowPrice = Number.MAX_VALUE;
            this._maxBuyNowPrice = 0;

            this._generatePalesnipeCalled = true;
        }
    }

    const UTMarketSearchView_setItems = UTMarketSearchView.prototype.setItems;
    UTMarketSearchView.prototype.setItems = function setItems(e, t) {
        if (this._superview
            && this._superview._superview
            && this._superview._superview._rView instanceof UTNavigationContainerView) {
            for (let entity of e) {
                if (entity._auction.buyNowPrice > this._maxBuyNowPrice) {
                    this._maxBuyNowPrice = entity._auction.buyNowPrice;
                }
                if (entity._auction.buyNowPrice < this._minBuyNowPrice) {
                    this._minBuyNowPrice = entity._auction.buyNowPrice;
                }
            }
            this._minPriceText.textContent = this._minBuyNowPrice;
            this._maxPriceText.textContent = this._maxBuyNowPrice;
            $(this._minMaxPriceContainer).show();
        }
        else {
            $(this._minMaxPriceContainer).hide();
        }

        UTMarketSearchView_setItems.call(this, e, t);
    }

    const UTItemTableCellView_render = UTItemTableCellView.prototype.render;
    UTItemTableCellView.prototype.render = function (e) {
        UTItemTableCellView_render.call(this, e);
        if (_enabled && this.data.isPlayer()) {
            $(".ut-item-view--main", this.__entityContainer).append(`<span class="player-definition-id">${this.data.definitionId}</span>`);
        }
    }

    function shouldRenderItem(item, searchCriteria) {
        let rating = searchCriteria.rating;

        if (!_enabled || !rating) return true;

        if (rating.charAt(0) === "+") {
            rating = parseInt(rating.substr(1));
            return item.rating >= rating;
        }
        else if (rating.charAt(0) === "-") {
            rating = parseInt(rating.substr(1));
            return item.rating <= rating;
        }
        else {
            rating = parseInt(rating);
            return item.rating == rating;
        }
    }

    const UTItemDomainRepository_isPileFull = UTItemDomainRepository.prototype.isPileFull;
    UTItemDomainRepository.prototype.isPileFull = function (e) {
        if (!_enabled) {
            UTItemDomainRepository_isPileFull.call(this, e);
            return;
        }

        var t = 0
            , i = this.pileSizes.get(e);
        switch (e) {
            case ItemPile.PURCHASED:
                t = this.unassigned.length;
                break;
            case ItemPile.TRANSFER:
                t = this.transfer.length;
                break;
            case ItemPile.INBOX:
                return 0;
            case ItemPile.CLUB:
                return !1
        }
        return (i || 0) <= t
    }

    enums.UIItemActionEvent.COPY_PLAYER_ID = "copyPlayerId";
    enums.UIItemActionEvent.FUTBIN_SEARCH = "futbinSearch";

    const UTDefaultActionPanelView__generate = UTDefaultActionPanelView.prototype._generate;
    UTDefaultActionPanelView.prototype._generate = function _generate() {
        UTDefaultActionPanelView__generate.call(this);
        if (!this._generatePalesnipeCalled) {

            this._copyPlayerIdButton = new UTGroupButtonControl();
            this._copyPlayerIdButton.init();
            this._copyPlayerIdButton.setText("Copy player ID to clipboard");
            this._copyPlayerIdButton.addTarget(this, this._onCopyPlayerId, EventType.TAP);

            this._futbinSearchButton = new UTGroupButtonControl();
            this._futbinSearchButton.init();
            this._futbinSearchButton.setText("View in futbin");
            this._futbinSearchButton.addTarget(this, this._onFutbinSearch, EventType.TAP);


            this.__itemActions.appendChild(this._copyPlayerIdButton.getRootElement());
            this.__itemActions.appendChild(this._futbinSearchButton.getRootElement());

            this._generatePalesnipeCalled = true;
        }
    }

    UTDefaultActionPanelView.prototype._onCopyPlayerId = function () {
        this._triggerActions(enums.UIItemActionEvent.COPY_PLAYER_ID);
    }

    UTDefaultActionPanelView.prototype._onFutbinSearch = function () {
        this._triggerActions(enums.UIItemActionEvent.FUTBIN_SEARCH);
    }

    const UTDefaultActionPanelView_destroyGeneratedElements = UTDefaultActionPanelView.prototype.destroyGeneratedElements;
    UTDefaultActionPanelView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTDefaultActionPanelView_destroyGeneratedElements.call(this);
        this._copyPlayerIdButton.destroy();
    }

    const ItemDetails__getPanelViewInstanceFromData = controllers.items.ItemDetails.prototype._getPanelViewInstanceFromData;
    controllers.items.ItemDetails.prototype._getPanelViewInstanceFromData = function _getPanelViewInstanceFromData(e, t) {
        ItemDetails__getPanelViewInstanceFromData.call(this, e, t);
        if(this._panel instanceof UTDefaultActionPanelView){
            this._panel.addTarget(this, this._onCopyPlayerId, enums.UIItemActionEvent.COPY_PLAYER_ID);
            this._panel.addTarget(this, this._onFutbinSearch, enums.UIItemActionEvent.FUTBIN_SEARCH);
        }
    }

    controllers.items.ItemDetails.prototype._onCopyPlayerId = function(){
        copyToClipboard(this._viewmodel.current().definitionId);
        notifySuccess("Player ID copied to clipboard!");
    }

    controllers.items.ItemDetails.prototype._onFutbinSearch = function(){
        window.open(`https://www.futbin.com/players?page=1&search=${this._viewmodel.current()._staticData.firstName}%20${this._viewmodel.current()._staticData.lastName}`);
    }

    const UTGameTabBarController_initWithViewControllers = UTGameTabBarController.prototype.initWithViewControllers;
    UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
        const palesnipeNav = new UTGameFlowNavigationController();
        palesnipeNav.initWithRootController(new PalesnipeSettingsController());
        palesnipeNav.tabBarItem = generatePalesnipeSettingsTab();
        tabs.push(palesnipeNav);
        UTGameTabBarController_initWithViewControllers.call(this, tabs);
    }

    function generatePalesnipeSettingsTab() {
        const tab = new UTTabBarItemView();
        tab.init();
        tab.setTag(6);
        tab.setText("Palesnipe Settings");
        tab.addClass("icon-transfer");
        tab.getRootElement().classList.add("palesnipe-element");
        return tab;
    }

    const
        l = console.log,
        loc = window.services.Localization,
        dispatchMouseEvent = ($target, eventName) => {
            if ($target.length == 0) return false;
            const mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initEvent(eventName);
            $target[0].dispatchEvent(mouseEvent);
            return true;
        },
        mouseDown = target => dispatchMouseEvent(target, 'mousedown'),
        mouseUp = target => dispatchMouseEvent(target, 'mouseup'),
        mouseClick = (target, delay, callback) => {
            if (delay) {
                setTimeout(() => {
                    callback(mouseClick(target));
                }, delay);
            }
            else {
                return mouseDown(target) && mouseUp(target);
            }
        },
        buyNow = (callback) => {
            if (mouseClick(buyBtn())) {
                if (_palesnipeSettings.buttons.results.pressEnter) {
                    tryPressOkBtn(callback);
                }
            }
        },
        tryPressOkBtn = (callback) => {
            if (!mouseClick(enterBtn())) {
                if (callback) {
                    setTimeout(callback(false), 0);
                }

                setTimeout(tryPressOkBtn, 10);
                return;
            }
            else {
                if (callback) {
                    callback(true);
                }
                updateBoughtUI();
            }
        },
        back = () => {
            l('back');
            if (!mouseClick(backBtn())) {
                setTimeout(back, 1);
            }
        },

        search = () => {
            mouseClick(searchBtn());
            if (_palesnipeSettings.buttons.results.autoBuy) {
                if (searchResults() == 0) {
                    l('researching');
                    setTimeout(search, 10);
                }
                else {
                    l($(".ut-no-results-view").length);
                    if ($(".ut-no-results-view").length > 0) {
                        l('no results');
                        back();
                    }
                    else {
                        l('buying');
                        buyNow((bought) => {
                            if (bought) {
                                mouseClick(transferBtn());
                            }
                        });
                    }
                }
            }
        },

        transferBtn = () => $(`.ut-button-group > button:contains('${loc.localize('infopanel.label.sendTradePile')}')`),
        clubBtn = () => $(`.ut-button-group > button:contains('${loc.localize('infopanel.label.storeInClub')}')`),
        sellBtn = () => $(`.ut-button-group > button:contains('${loc.localize('infopanel.label.discard')}')`),
        buyBtn = () => $('.buyButton'),
        backBtn = () => $('.ut-navigation-button-control'),
        enterBtn = () => $('.ea-dialog-view .ut-button-group button:eq(0)'),
        searchBtn = () => $('.button-container .btn-standard.call-to-action'),
        searchResults = () => $('.SearchResults').length,


        keys = (p) => {
            let b = {};

            b[p.back] = () => back();

            if ($('.ut-market-search-filters-view').length > 0) {
                b[p.search.decMinBid] = () => mouseClick($('.decrement-value'));
                b[p.search.incMinBid] = () => mouseClick($('.increment-value'));
                b[p.search.decMaxBid] = () => mouseClick($('.decrement-value:eq(1)'));
                b[p.search.incMaxBid] = () => mouseClick($('.increment-value:eq(1)'));
                b[p.search.decMinBuy] = () => mouseClick($('.decrement-value:eq(2)'));
                b[p.search.incMinBuy] = () => mouseClick($('.increment-value:eq(2)'));
                b[p.search.decMaxBuy] = () => mouseClick($('.decrement-value:eq(3)'));
                b[p.search.incMaxBuy] = () => mouseClick($('.increment-value:eq(3)'));
                b[p.search.search] = () => search();
                b[p.search.resetBid] = () => mouseClick($('.search-price-header > button:first'));
                b[p.search.botModeMinBid] = () => {
                    if (p.search.enableBotMode && b[p.search.incMinBid]()) {
                        search();
                    }
                };
                b[p.search.botModeMinBuy] = () => {
                    if (p.search.enableBotMode && b[p.search.incMinBuy]()) {
                        search();
                    }
                }
            }
            else {
                let items = $(".listFUTItem");
                let itemsExists = items.length > 0;
                let itemsContainer = items.parents('.paginated, .ut-watch-list-view, .ut-transfer-list-view');
                if (itemsContainer.length == 0) {
                    itemsContainer = items.parent();
                }

                if (itemsExists && $('.DetailPanel > .bidOptions').length > 0) {
                    b[p.results.bid] = () => mouseClick($('.bidButton'));
                    b[p.results.buy] = () => buyNow();
                    b[p.results.decBid] = () => mouseClick($('.bidOptions .decrement-value'));
                    b[p.results.incBid] = () => mouseClick($('.bidOptions .increment-value'));
                    b[p.search.botModeMinBid] = () => p.search.enableBotMode ? buyNow() : false;
                    b[p.search.botModeMinBuy] = () => p.search.enableBotMode ? buyNow() : false;
                }

                if (itemsExists && $('.DetailPanel > .ut-button-group').length > 0) {
                    b[p.results.transfer] = () => mouseClick(transferBtn());
                    b[p.results.club] = () => mouseClick(clubBtn());
                    b[p.results.sell] = () => mouseClick(sellBtn());
                }

                if (itemsExists) {
                    b[p.lists.up] = () => {
                        let container = itemsContainer;
                        let selected = $('.listFUTItem.selected', container).prev();
                        if (selected.length === 0) {
                            selected = $(".listFUTItem:last-child", container);
                        }
                        mouseClick(selected);
                        container.css('position', 'relative');
                        container.scrollTop(container.scrollTop() + selected.position().top - selected.height());
                    };
                    b[p.lists.down] = () => {
                        let container = itemsContainer;
                        let selected = $('.listFUTItem.selected', container).next();
                        if (selected.length === 0) {
                            selected = $(".listFUTItem:first-child", container);
                        }
                        mouseClick(selected);
                        container.css('position', 'relative');
                        container.scrollTop(container.scrollTop() + selected.position().top);
                    };
                }
                else {
                    b[p.search.botModeMinBid] = () => p.search.enableBotMode ? back() : false;
                    b[p.search.botModeMinBuy] = () => p.search.enableBotMode ? back() : false;
                }

                if ($('.pagingContainer').length > 0) {
                    b[p.lists.prev] = () => mouseClick($('.pagingContainer .prev:visible'));
                    b[p.lists.next] = () => mouseClick($('.pagingContainer .next:visible'));
                }
            }

            return b;
        };

    // UI update after buy now
    const updateBoughtUI = () => {
        if (!_enabled) return;

        var txBtn = transferBtn();
        if (txBtn.length == 0) {
            setTimeout(updateBoughtUI, 50);
            return;
        }

        let upd = (t, tx) => {
            if (!t) return;
            let add = ` [ ${_palesnipeSettings.buttons.results[tx]} ]`;
            let html = t.html();
            if (html && html.indexOf(add) == -1) {
                t.html(t.html() + add);
            }
        }

        upd(txBtn, 'transfer');
        upd(clubBtn(), 'club');
        upd(sellBtn(), 'sell');
    };

    const addCss = (p) => {
        let btn = (q, k1, k2, inc) => `${q} .${(inc ? 'in' : 'de')}crement-value:after { font-size:10px; display:block; margin-top:-30px; content: '[ ${p[k1][k2]} ]' }`;
        let sp1 = (i, k, inc) => btn(`.search-prices .price-filter:nth-child(${i})`, 'search', k, inc);
        let sp2 = (i, k1, k2) => `${sp1(i, k1)}${sp1(i, k2, true)}`;
        let css = `
            ${sp2(2, 'decMinBid', 'incMinBid')}
            ${sp2(3, 'decMaxBid', 'incMaxBid')}
            ${sp2(5, 'decMinBuy', 'incMinBuy')}
            ${sp2(6, 'decMaxBuy', 'incMaxBuy')}
            ${btn('.DetailPanel > .bidOptions', 'results', 'decBid', false)}
            ${btn('.DetailPanel > .bidOptions', 'results', 'incBid', true)}
            .ut-market-search-filters-view .call-to-action:after { content: '[ ${p.search.search}]'}
            .ut-market-search-filters-view .search-price-header:first-child > button:after { content: '[ ${p.search.resetBid}]';  font-size: 10px; display: block  }
            .ut-navigation-button-control:after { font-size:10px; float:right; margin-right:12px; content: '[ ${p.back} ]' }
            .pagingContainer .prev:after { font-size: 10px; display:block; content: '[ ${p.lists.prev} ]' }
            .pagingContainer .next:after { font-size: 10px; display:block; content: '[ ${p.lists.next} ]' }
            .bidButton:after { content: ' [ ${p.results.bid} ]' }
            .buyButton:before { float:right; content: ' [ ${p.results.buy} ]' }
            .player-definition-id { position: absolute; bottom: 0; }
            .saved-filters { display: inline-block; margin-left: 8px; margin-bottom: 8px;}
            .saved-filters > input {display: inline-block; width: auto; }
            .saved-filters > button { display: inline-block; margin-left: 8px;}
            .saved-filters > div { float: right; margin-left: 8px;}
            .min-price-label, .max-price-label { color: #88909b; margin-right: 2px; }
            .min-price-label:after, .max-price-label:after { content: ':' }
            .min-max-prices { font-size: 14px; }
            .max-price { float: right; }
            #palesnipe-donation-ui { float: left; margin-left: 20px; line-height: 50px;}
            #palesnipe-donation-ui > h3, #palesnipe-donation-ui > div { display: inline }
            #palesnipe-donation-ui > div:before { content: '|'; margin-right: 8px; }
            #palesnipe-donation-ui a { color: white; }
            .palesnipe-settings-wrapper input { width: 150px; margin-left: 8px; display: table-cell; margin-bottom: 2px; }
            .palesnipe-settings-wrapper > div { display: table; float: left; margin-left: 8px; }
            .palesnipe-settings-wrapper > div > div { display: table-row; }
            .palesnipe-settings-wrapper > div > div > label { display: table-cell; }
            .palesnipe-settings-wrapper > div:nth-child(4) { clear:left;}
            .palesnipe-settings-wrapper .ut-toggle-control { width: 30px; float:right; }
            .palesnipe-settings-wrapper > div > div { line-height: 40px;}
            `;

        _appStyles.innerText = css;
    };

    function resetCss() {
        addCss(_palesnipeSettings.buttons);
    }

    function addDonationUI() {
        $(".ut-fifa-header-view").append(`<div id="palesnipe-donation-ui" class="palesnipe-element">
                <h3 class="title">${VERSION} - Powered by Paletools</h3>
                <div><a href="https://streamlabs.com/paleta_ar/tip" target="_blank">PayPal Donation</a></div>
                <div><a href="https://ceneka.net/mp/d/paletaeaa" target="_blank">MercadoPago Donation</a></div>
                <div>Follow me at&nbsp;<a href="https://twitter.com/paleta" target="_blank">@paleta</a></div>
            </div>`);
    }

    function enableDisableApp() {
        if (_enabled) {
            disableApp();
        }
        else {
            enableApp();
        }
    }

    function notifySuccess(msg){
        services.Notification.queue([msg, UINotificationType.POSITIVE]);
    }

    function notifyNeutral(msg){
        services.Notification.queue([msg, UINotificationType.NEUTRAL])
    }

    function enableApp() {
        _enabled = true;
        resetCss();
        notifySuccess("Palesnipe Enabled");
    }

    function disableApp() {
        _enabled = false;
        _appStyles.innerText = ".palesnipe-element { display: none; }";
        notifyNeutral("Palesnipe Disabled");
    }

    document.body.addEventListener('keydown', e => {
        let p = _palesnipeSettings.buttons;
        if (e.code == p.enableDisable) {
            enableDisableApp();
        }

        if (!_enabled) {
            return;
        }

        let action = keys(p)[e.code];
        if (action) action();
    });

    document.body.appendChild(_appStyles);
    enableApp();
    addDonationUI();
    getAppMain().getRootViewController().showGameView();
})(/*BUTTONS*/);