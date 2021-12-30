(function (buttons) {
    const VERSION = "v0.1.0";

    if (window.__palesnipeMobileActive) return;
    window.__palesnipeMobileActive = true;
    _enabled = false;

    window.MAX_NEW_ITEMS = Number.MAX_VALUE;

    const getCurrentController = () => getAppMain().getRootViewController().getPresentedViewController().getCurrentViewController().getCurrentController();

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


    // $(".ut-fifa-header-view").append(`
    //     <button id="throw">DEBUG</button>
    //     <button id="bot-mode-inc-bid">BOT INC BID</button>
    //     <button id="bot-mode-inc-buy">BOT INC BUY</button>`);

    $("#throw").click(function () {
        throw new Error("debug error");
    });

    $("#bot-mode-inc-bid").click(function () {
        botMode(this);
    });

    $("#bot-mode-inc-buy").click(function () {
        botMode(this);
    });

    window.palesnipe = function (button) {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            if (button.id == "bot-mode-inc-bid") {
                incrementMinBid();
                search();
            }
            else {
                incrementMinBuyNow();
                search();
            }
        }
        else if (controller instanceof UTMarketSearchResultsSplitViewController) {
            buyNow();
            back();
        }
    }

    window.enableDisablePalesnipe = function () {
        if (_enabled) {
            disableApp();
        }
        else {
            enableApp();
        }
    }

    function notifySuccess(msg) {
        services.Notification.queue([msg, UINotificationType.POSITIVE]);
    }

    function notifyNeutral(msg) {
        services.Notification.queue([msg, UINotificationType.NEUTRAL])
    }

    function enableApp() {
        _enabled = true;
        notifySuccess("Palesnipe Enabled");
    }

    function disableApp() {
        _enabled = false;
        notifyNeutral("Palesnipe Disabled");
    }

    const
        incrementMinBid = () => {
            const controller = getCurrentController();
            if (!(controller instanceof UTMarketSearchFiltersViewController)) return;

            controller.getView()._minBidPriceRow._currencyInput.beginIncrease();
            controller.getView()._minBidPriceRow._currencyInput.endIncrease();
        },
        incrementMinBuyNow = () => {
            const controller = getCurrentController();
            if (!(controller instanceof UTMarketSearchFiltersViewController)) return;

            controller.getView()._minBuyNowPriceRow._currencyInput.beginIncrease();
            controller.getView()._minBuyNowPriceRow._currencyInput.endIncrease();
        },
        search = () => {
            const controller = getCurrentController();
            if (!(controller instanceof UTMarketSearchFiltersViewController)) return;
            controller.getView()._eSearchButtonSelected();
        },
        back = () => {
            getCurrentController().getNavigationController()._eBackButtonTapped();
        },
        buyNow = () => {
            const controller = getCurrentController();
            if (controller._itemDetailController
                && controller._itemDetailController._currentController
                && controller._itemDetailController._currentController._currentAuction) {
                controller._itemDetailController._currentController._requestedBid = controller._itemDetailController._currentController._currentAuction.buyNowPrice;
                controller._itemDetailController._currentController._eBidConfirmed();
            }

        };

    window.enableDisablePalesnipe();
})();