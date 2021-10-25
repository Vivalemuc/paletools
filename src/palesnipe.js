(function (buttons) {
    const VERSION = "v3.0.0";

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
    let p = buttons;
    let enabled = true;
    let appStyles = document.createElement("style");

    // reset console
    let iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    window.console = iframe.contentWindow.console;

    window.MAX_NEW_ITEMS = Number.MAX_VALUE;

    let _selectedRating = null;
    let _isMarketSearch = false;

    const getCurrentController = () => getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();

    // $(".ut-fifa-header-view").append(`<button id="throw">DEBUG</button>`);

    $("#throw").click(function () {
        throw new Error("debug error");
    });

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
        }
    }

    UTMarketSearchFiltersView.prototype.loadFilter = function (filter) {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            if (filter.criteria.defId && filter.criteria.defId.length > 0) {
                this._playerId.setValue(filter.criteria.defId[0]);
            }
            this._playerRating.setValue(filter.criteria.rating);
            _selectedRating = filter.criteria.rating;
            for (let key of Object.keys(filter.criteria)) {
                controller._viewmodel.searchCriteria[key] = filter.criteria[key];
                this.setFilters(controller._viewmodel);
            }
        }
    }

    const UTMarketSearchFiltersView_setFilters = UTMarketSearchFiltersView.prototype.setFilters;
    UTMarketSearchFiltersView.prototype.setFilters = function setFilters(e, t) {
        if (e.searchCriteria.defId && e.searchCriteria.defId.length > 0) {
            this._playerId.setValue(e.searchCriteria.defId[0])
        }
        this._playerRating.setValue(_selectedRating);
        UTMarketSearchFiltersView_setFilters.call(this, e, t);
    }

    const UTMarketSearchFiltersView_destroyGeneratedElements = UTMarketSearchFiltersView.prototype.destroyGeneratedElements;
    UTMarketSearchFiltersView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTMarketSearchFiltersView_destroyGeneratedElements.call(this);
        this._playerId.destroy();
        this._playerRating.destroy();
        this._filterName.destroy();
        this._saveFilterButton.destroy();
        this._deleteFilterButton.destroy();
        this._savedFilters.destroy();
    }

    UTMarketSearchFiltersView.prototype.handlePlayerIdChange = function (_, __, elem) {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            controller._viewmodel.searchCriteria.defId = [elem.value];
        }
    }

    UTMarketSearchFiltersView.prototype.handlePlayerRatingChange = function (_, __, elem) {
        _selectedRating = elem.value;
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
        _selectedRating = null;
        UTMarketSearchFiltersViewController__eResetSelected.call(this);
    }

    const UTMarketSearchFiltersView__eSearchButtonSelected = UTMarketSearchFiltersView.prototype._eSearchButtonSelected;
    UTMarketSearchFiltersView.prototype._eSearchButtonSelected = function _eSearchButtonSelected() {
        _isMarketSearch = true;
        UTMarketSearchFiltersView__eSearchButtonSelected.call(this);
    }

    UTPaginatedItemListView.prototype.setItems = function (e, i) {
        var o = this;
        this.removeListRows();

        e.forEach(function (e) {
            if (shouldRenderItem(e)) {
                var t = new UTItemTableCellView;
                t.setData(e, void 0, void 0, i),
                    o.listRows.push(t)
            }
        });

        _isMarketSearch = false;

        return this.listRows;
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
                .append('<span class="min-price-label">Min Price</span>')
                .append(this._minPriceText);
            const maxPriceContainer = document.createElement("span");
            maxPriceContainer.classList.add("max-price");
            $(maxPriceContainer)
                .append('<span class="min-price-label">Min Price</span>')
                .append(this._maxPriceText);


            $(this._minMaxPriceContainer)
                .append(minPriceContainer)
                .append(maxPriceContainer)
                .insertBefore(this._list.getRootElement());
            this._generatePalesnipeCalled = true;
        }
    }

    const UTMarketSearchView_setItems = UTMarketSearchView.prototype.setItems;
    UTMarketSearchView.prototype.setItems = function setItems(e, t) {
        if (this._superview
            && this._superview._superview
            && this._superview._superview._rView instanceof UTNavigationContainerView) {
            let minBuyNowPrice = Number.MAX_VALUE;
            let maxBuyNowPrice = 0;
            for (let entity of e) {
                if (entity._auction.buyNowPrice > maxBuyNowPrice) {
                    maxBuyNowPrice = entity._auction.buyNowPrice;
                }
                if (entity._auction.buyNowPrice < minBuyNowPrice) {
                    minBuyNowPrice = entity._auction.buyNowPrice;
                }
            }
            this._minPriceText.textContent = minBuyNowPrice;
            this._maxPriceText.textContent = maxBuyNowPrice;
            $(this._minMaxPriceContainer).show();
        }
        else {
            $(this._minMaxPriceContainer).hide();
        }

        UTMarketSearchView_setItems.call(this, e, t);
    }

    UTItemTableCellView.prototype._oldRender = UTItemTableCellView.prototype.render;
    UTItemTableCellView.prototype.render = function (e) {
        this._oldRender();
        if (this.data.isPlayer()) {
            $(".ut-item-view--main", this.__entityContainer).append(`<span class="player-definition-id">${this.data.definitionId}</span>`);
        }
    }

    function shouldRenderItem(item) {
        let rating = _selectedRating;

        if (!_isMarketSearch) return true;
        if (!rating) return true;

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

    UTItemDomainRepository.prototype.isPileFull = function (e) {
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
                if (p.results.pressEnter) {
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
            if (p.results.autoBuy) {
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


        keys = () => {
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
                    if (b.search.enableBotMode && b[p.search.incMinBid]()) {
                        search();
                    }
                };
                b[p.search.botModeMinBuy] = () => {
                    if (b.search.enableBotMode && b[p.search.incMinBuy]()) {
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
                    b[p.search.botModeMinBid] = () => b.search.enableBotMode ? buyNow() : false;
                    b[p.search.botModeMinBuy] = () => b.search.enableBotMode ? buyNow() : false;
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
                    b[p.search.botModeMinBid] = () => b.search.enableBotMode ? back() : false;
                    b[p.search.botModeMinBuy] = () => b.search.enableBotMode ? back() : false;
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
        if (!enabled) return;

        var txBtn = transferBtn();
        if (txBtn.length == 0) {
            setTimeout(updateBoughtUI, 50);
            return;
        }

        let upd = (t, tx) => {
            if (!t) return;
            let add = ` [ ${p.results[tx]} ]`;
            let html = t.html();
            if (html && html.indexOf(add) == -1) {
                t.html(t.html() + add);
            }
        }

        upd(txBtn, 'transfer');
        upd(clubBtn(), 'club');
        upd(sellBtn(), 'sell');
    };

    const addCss = () => {
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
            .donation-ui { float: left; margin-left: 20px; line-height: 50px;}
            .donation-ui > h3, .donation-ui > div { display: inline }
            .donation-ui > div:before { content: '|'; margin-right: 8px; }
            .donation-ui a { color: white; }
            `;

        appStyles.innerText = css;
    };

    function addDonationUI(){
        $(".ut-fifa-header-view").append(`<div class='donation-ui'>
                <h3 class="title">Powered by Paletools</h3>
                <div><a href="https://streamlabs.com/paleta_ar/tip" target="_blank">PayPal Donation</a></div>
                <div><a href="https://ceneka.net/mp/d/paletaeaa" target="_blank">MercadoPago Donation</a></div>
                <div>Follow me at&nbsp;<a href="https://twitter.com/paleta" target="_blank">@paleta</a></div>
            </div>`);
    }

    function enableDisableApp() {
        if (enabled) {
            disableApp();
        }
        else {
            enableApp();
        }
    }

    function enableApp() {
        enabled = true;
        document.body.appendChild(appStyles);
        services.Notification.queue(["Palesnipe Enabled", UINotificationType.POSITIVE])
    }

    function disableApp() {
        enabled = false;
        document.body.removeChild(appStyles);
        services.Notification.queue(["Palesnipe Disabled", UINotificationType.NEUTRAL])
    }

    document.body.addEventListener('keydown', e => {
        if (e.code == p.enableDisable) {
            enableDisableApp();
        }

        if (!enabled) {
            return;
        }

        let action = keys()[e.code];
        if (action) action();
    });

    addCss();
    addDonationUI();
    enableApp();
})(/*BUTTONS*/);