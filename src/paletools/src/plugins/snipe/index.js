let plugin;

/// #if process.env.SNIPE
import mouseClick from "../../utils/mouse";
import localize from "../../localization";
import settings from "../../settings";
import { on } from "../../events";
import enableDisableApp from "../../app";
import { addStyle, removeStyle } from "../../utils/styles";
import menu from "./menu";
import getCurrentController from "../../utils/controller";
import UTMarketSearchResultsSplitViewControllerHelpers from "../../helpers/UTMarketSearchResultsSplitViewControllerHelpers";

const cfg = settings.plugins.snipe;

const utils_PopupManager_showConfirmation = utils.PopupManager.showConfirmation;
utils.PopupManager.showConfirmation = function showConfirmation(e, t, i, o) {
    if (!cfg.buttons.results.pressEnter) {
        utils_PopupManager_showConfirmation(this, e, t, i, o);
    }
    else {
        if (e !== utils.PopupManager.Confirmations.CONFIRM_BUY_NOW) {
            utils_PopupManager_showConfirmation.call(this, e, t, i, o);
        }
        else {
            i();
        }
    }
}

const UTDefaultActionPanelView_render = UTDefaultActionPanelView.prototype.render;
UTDefaultActionPanelView.prototype.render = function (e, t, i, o, n, r, s) {
    UTDefaultActionPanelView_render.call(this, e, t, i, o, n, r, s);
    if (!this.snipeGenerated) {

        this._sendClubButton.getRootElement().classList.add("send-to-club");
        this._sendTransferButton.getRootElement().classList.add("send-to-transfer-list");
        this._discardButton.getRootElement().classList.add("quick-sell");
        this._comparePriceButton.getRootElement().classList.add("compare-price");
        this.snipeGenerated = true;
    }
}

function run() {

    const
        buyNow = () => {
            // if (cfg.buttons.results.pressEnter) {
            //     let controller = getCurrentController();
            //     let itemDetailsController = controller._rightController._currentController;
            //     const currentAuction = itemDetailsController._currentAuction;
            //     if (currentAuction._tradeState !== "expired") {
            //         itemDetailsController._onBuyNow();
            //         // itemDetailsController._requestedBid = currentAuction.buyNowPrice;
            //         // itemDetailsController._eBidConfirmed();
            //     }
            // }
            // else {
                getCurrentController()._rightController._currentController._panel.onBuyNow.notify();
            // }
        },
        bid = () => {
            const itemDetailsController = getCurrentController()._rightController._currentController;
            itemDetailsController._panel.onBid.notify(itemDetailsController._panel._bidNumericStepper.getValue());
        },
        back = () => {
            getCurrentController().getNavigationController()._eBackButtonTapped();
        },

        search = () => {
            const view = getCurrentController().getView();

            view._eMinBidPriceChanged();
            view._eMaxBidPriceChanged();
            view._eMinBuyPriceChanged();
            view._eMaxBuyPriceChanged();

            if (view.updateSearchCriteria) {
                (view.updateSearchCriteria)();
            }

            getCurrentController().getView()._eSearchButtonSelected();
        },

        transferBtn = () => $("button.send-to-transfer-list"),
        clubBtn = () => $("button.send-to-club"),
        sellBtn = () => $("button.quick-sell"),
        compareBtn = () => $("button.compare-price"),

        addMarketSearchKeys = (keys, buttons, controller) => {
            if (!(controller instanceof UTMarketSearchFiltersViewController)) return;

            keys[buttons.search.decMinBid] = () => {
                controller.getView()._minBidPriceRow._currencyInput.beginDecrease();
                controller.getView()._minBidPriceRow._currencyInput.endDecrease();
            };
            keys[buttons.search.incMinBid] = () => {
                controller.getView()._minBidPriceRow._currencyInput.beginIncrease();
                controller.getView()._minBidPriceRow._currencyInput.endIncrease();
            };
            keys[buttons.search.decMaxBid] = () => {
                controller.getView()._maxBidPriceRow._currencyInput.beginDecrease();
                controller.getView()._maxBidPriceRow._currencyInput.endDecrease();
            };
            keys[buttons.search.incMaxBid] = () => {
                controller.getView()._maxBidPriceRow._currencyInput.beginIncrease();
                controller.getView()._maxBidPriceRow._currencyInput.endIncrease();
            };
            keys[buttons.search.decMinBuy] = () => {
                controller.getView()._minBuyNowPriceRow._currencyInput.beginDecrease();
                controller.getView()._minBuyNowPriceRow._currencyInput.endDecrease();
            };
            keys[buttons.search.incMinBuy] = () => {
                controller.getView()._minBuyNowPriceRow._currencyInput.beginIncrease();
                controller.getView()._minBuyNowPriceRow._currencyInput.endIncrease();
            };
            keys[buttons.search.decMaxBuy] = () => {
                controller.getView()._maxBuyNowPriceRow._currencyInput.beginDecrease();
                controller.getView()._maxBuyNowPriceRow._currencyInput.endDecrease();
            };
            keys[buttons.search.incMaxBuy] = () => {
                controller.getView()._maxBuyNowPriceRow._currencyInput.beginIncrease();
                controller.getView()._maxBuyNowPriceRow._currencyInput.endIncrease();
            };
            keys[buttons.search.search] = () => search();
            keys[buttons.search.resetBid] = () => {
                controller.getView()._minBidPriceRow.value = 0;
                controller.getView()._maxBidPriceRow.value = 0;
            };
            keys[buttons.search.botModeMinBid] = () => {
                if (buttons.search.enableBotMode) {
                    keys[buttons.search.incMinBid]();
                    search();
                }
            };
            keys[buttons.search.botModeMinBuy] = () => {
                if (buttons.search.enableBotMode) {
                    keys[buttons.search.incMinBuy]()
                    search();
                }
            }
        },

        addMarketSearchResultsKeys = (keys, buttons, controller) => {
            if (!(controller instanceof UTMarketSearchResultsSplitViewController)) return;

            const list = controller._leftController.getView()._list;
            const items = list.listRows;
            let itemsExists = items.length > 0;

            if (itemsExists) {
                let selectedIndex = list.listRows.findIndex(x => x.__root.classList.contains("selected"));

                keys[buttons.lists.up] = () => {
                    if (selectedIndex - 1 < 0) {
                        selectedIndex = items.length - 1;
                    }
                    else {
                        selectedIndex--;
                    }

                    UTMarketSearchResultsSplitViewControllerHelpers.selectListItemByIndex(selectedIndex);
                };
                keys[buttons.lists.down] = () => {
                    if (selectedIndex + 1 >= items.length) {
                        selectedIndex = 0;
                    }
                    else {
                        selectedIndex++;
                    }

                    UTMarketSearchResultsSplitViewControllerHelpers.selectListItemByIndex(selectedIndex);
                };
            }
            else {
                keys[buttons.search.botModeMinBid] = () => buttons.search.enableBotMode ? back() : false;
                keys[buttons.search.botModeMinBuy] = () => buttons.search.enableBotMode ? back() : false;
            }
        },

        addItemDetailsViewKeys = (keys, buttons, controller) => {
            if (!controller._rightController
                || !controller._rightController._currentController
                || controller._rightController._currentController.className !== "ItemDetailsViewController")
                return;

            const itemDetailsController = controller._rightController._currentController;
            const { _bidState, _tradeState, tradeId } = itemDetailsController._currentAuction;
            if (_tradeState === "active" && _bidState !== "highest") {
                keys[buttons.results.bid] = () => bid();
                keys[buttons.results.buy] = () => buyNow();
                keys[buttons.results.decBid] = () => {
                    const stepper = itemDetailsController._panel._bidNumericStepper;
                    stepper.beginDecrease();
                    stepper.endDecrease();
                };
                keys[buttons.results.incBid] = () => {
                    const stepper = itemDetailsController._panel._bidNumericStepper;
                    stepper.beginIncrease();
                    stepper.endIncrease();
                };

                if (buttons.search.enableBotMode) {
                    keys[buttons.search.botModeMinBid] = keys[buttons.search.botModeMinBuy] = () => buyNow();
                }
            }

            keys[buttons.results.compare] = () => mouseClick(compareBtn());

            // Bid won
            if (_tradeState === "closed" && (_bidState === "highest" || _bidState === "buyNow")) {
                keys[buttons.results.transfer] = () => mouseClick(transferBtn());
                keys[buttons.results.club] = () => mouseClick(clubBtn());
                keys[buttons.results.sell] = () => mouseClick(sellBtn());
            }

            // club player
            if (tradeId === "0") {
                const player = itemDetailsController._viewmodel._collection[itemDetailsController._viewmodel._index];
                if (!player.untradeable) {
                    keys[buttons.results.transfer] = () => mouseClick(transferBtn());
                }

                keys[buttons.results.club] = () => mouseClick(clubBtn());

                if (player.discardable) {
                    keys[buttons.results.sell] = () => mouseClick(sellBtn());
                }
            }
        },

        addPaginationKeys = (keys, buttons, controller) => {
            if ($(".pagingContainer").is(":visible")) {
                keys[buttons.lists.prev] = () => {
                    const prevPage = $(".pagingContainer > button.pagination.prev");
                    if (prevPage.is(":visible")) {
                        mouseClick(prevPage);
                    }
                }
                keys[buttons.lists.next] = () => {
                    const nextPage = $(".pagingContainer > button.pagination.next");
                    if (nextPage.is(":visible")) {
                        mouseClick(nextPage);
                    }
                }
            }
        },

        keys = (buttons) => {
            let keys = {};

            const controller = getCurrentController();

            keys[buttons.back] = () => back();

            addMarketSearchKeys(keys, buttons, controller);
            addMarketSearchResultsKeys(keys, buttons, controller);
            addItemDetailsViewKeys(keys, buttons, controller);
            addPaginationKeys(keys, buttons, controller);

            return keys;
        },

        addCss = (p) => {
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
        .send-to-transfer-list .btn-text:after { content: ' [ ${p.results.transfer} ]' }
        .send-to-club .btn-text:after { content: ' [ ${p.results.club} ]' }
        .quick-sell .btn-text:after { content: ' [ ${p.results.sell} ]' }
        .compare-price .btn-text:after { content: ' [ ${p.results.compare} ]' }
        `;

            addStyle('palesnipe-styles', css);
        },
        resetCss = () => {
            removeStyle('palesnipe-styles');
            addCss(cfg.buttons);
        };

    on('appEnabled', () => {
        resetCss();
    });

    on('appDisabled', () => {
        removeStyle('palesnipe-styles');
        addStyle('palesnipe-styles', '.palesnipe-element { display: none !important; }');
    })

    on('configurationSaved', () => {
        resetCss();
    });

    document.body.addEventListener('keydown', e => {
        if (e.code === cfg.buttons.enableDisable) {
            enableDisableApp();
        }

        if (!settings.enabled) return;

        let action = keys(cfg.buttons)[e.code];
        if (action) {
            action();
            e.preventDefault();
        }
    });

    addCss(cfg.buttons);
}

plugin = {
    run: run,
    order: 7,
    settings: {
        name: "snipe",
        title: 'plugins.snipe.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;