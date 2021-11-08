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

const UTDefaultActionPanelView_render = UTDefaultActionPanelView.prototype.render;
UTDefaultActionPanelView.prototype.render = function (e, t, i, o, n, r, s) {
    UTDefaultActionPanelView_render.call(this, e, t, i, o, n, r, s);
    if (!this.snipeGenerated) {

        this._sendClubButton.getRootElement().classList.add("send-to-club");
        this._sendTransferButton.getRootElement().classList.add("send-to-transfer-list");
        this._discardButton.getRootElement().classList.add("quick-sell");
        this.snipeGenerated = true;
    }
}

function run() {

    const
        buyNow = () => {
            if (cfg.buttons.results.pressEnter) {
                let controller = getCurrentController();
                let itemDetailsController = controller._rightController._currentController;
                const currentAuction = itemDetailsController._currentAuction;
                if (currentAuction._tradeState !== "expired") {
                    itemDetailsController._requestedBid = currentAuction.buyNowPrice;
                    itemDetailsController._eBidConfirmed();
                }
            }
            else {
                getCurrentController()._rightController._currentController._panel.onBuyNow.notify();
            }
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

            getCurrentController().getView()._eSearchButtonSelected();
        },

        transferBtn = () => $(`.ut-button-group > button:contains('${localize('infopanel.label.sendTradePile')}')`),
        clubBtn = () => $(`.ut-button-group > button:contains('${localize('infopanel.label.storeInClub')}')`),
        sellBtn = () => $(`.ut-button-group > button:contains('${localize('infopanel.label.discard')}')`),

        keys = (p) => {
            let b = {};

            const controller = getCurrentController();

            b[p.back] = () => back();

            if (controller instanceof UTMarketSearchFiltersViewController) {
                b[p.search.decMinBid] = () => {
                    controller.getView()._minBidPriceRow._currencyInput.beginDecrease();
                    controller.getView()._minBidPriceRow._currencyInput.endDecrease();
                };
                b[p.search.incMinBid] = () => {
                    controller.getView()._minBidPriceRow._currencyInput.beginIncrease();
                    controller.getView()._minBidPriceRow._currencyInput.endIncrease();
                };
                b[p.search.decMaxBid] = () => {
                    controller.getView()._maxBidPriceRow._currencyInput.beginDecrease();
                    controller.getView()._maxBidPriceRow._currencyInput.endDecrease();
                };
                b[p.search.incMaxBid] = () => {
                    controller.getView()._maxBidPriceRow._currencyInput.beginIncrease();
                    controller.getView()._maxBidPriceRow._currencyInput.endIncrease();
                };
                b[p.search.decMinBuy] = () => {
                    controller.getView()._minBuyNowPriceRow._currencyInput.beginDecrease();
                    controller.getView()._minBuyNowPriceRow._currencyInput.endDecrease();
                };
                b[p.search.incMinBuy] = () => {
                    controller.getView()._minBuyNowPriceRow._currencyInput.beginIncrease();
                    controller.getView()._minBuyNowPriceRow._currencyInput.endIncrease();
                };
                b[p.search.decMaxBuy] = () => {
                    controller.getView()._maxBuyNowPriceRow._currencyInput.beginDecrease();
                    controller.getView()._maxBuyNowPriceRow._currencyInput.endDecrease();
                };
                b[p.search.incMaxBuy] = () => {
                    controller.getView()._maxBuyNowPriceRow._currencyInput.beginIncrease();
                    controller.getView()._maxBuyNowPriceRow._currencyInput.endIncrease();
                };
                b[p.search.search] = () => search();
                b[p.search.resetBid] = () => {
                    controller.getView()._minBidPriceRow.value = 0;
                    controller.getView()._maxBidPriceRow.value = 0;
                };
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
            else if (controller instanceof UTMarketSearchResultsSplitViewController) {
                const searchResultsController = controller._leftController;
                const list = searchResultsController.getView()._list;
                const items = list.listRows;
                let itemsExists = items.length > 0;

                if (itemsExists) {
                    let selectedIndex = list.listRows.findIndex(x => x.__root.classList.contains("selected"));

                    const itemDetailsController = controller._rightController._currentController;
                    const tradeState = itemDetailsController._currentAuction._tradeState;
                    if (tradeState === "active") {
                        b[p.results.bid] = () => bid();
                        b[p.results.buy] = () => buyNow();
                        b[p.results.decBid] = () => {
                            const stepper = itemDetailsController._panel._bidNumericStepper;
                            stepper.beginDecrease();
                            stepper.endDecrease();
                        };
                        b[p.results.incBid] = () => {
                            const stepper = itemDetailsController._panel._bidNumericStepper;
                            stepper.beginIncrease();
                            stepper.endIncrease();
                        };
                        b[p.search.botModeMinBid] = () => p.search.enableBotMode ? buyNow() : false;
                        b[p.search.botModeMinBuy] = () => p.search.enableBotMode ? buyNow() : false;
                    }

                    if (tradeState === "closed") {
                        b[p.results.transfer] = () => mouseClick(transferBtn());
                        b[p.results.club] = () => mouseClick(clubBtn());
                        b[p.results.sell] = () => mouseClick(sellBtn());
                    }

                    b[p.lists.up] = () => {
                        if (selectedIndex - 1 < 0) {
                            selectedIndex = items.length - 1;
                        }
                        else {
                            selectedIndex--;
                        }

                        UTMarketSearchResultsSplitViewControllerHelpers.selectListItemByIndex(selectedIndex);
                    };
                    b[p.lists.down] = () => {
                        if (selectedIndex + 1 >= items.length) {
                            selectedIndex = 0;
                        }
                        else {
                            selectedIndex++;
                        }

                        UTMarketSearchResultsSplitViewControllerHelpers.selectListItemByIndex(selectedIndex);
                    };

                    if (list.__botPagination.style.display !== "none") {
                        b[p.lists.prev] = () => {
                            searchResultsController._ePrevPage();
                        }
                        b[p.lists.next] = () => {
                            searchResultsController._eNextPage();
                        }
                    }
                }
                else {
                    b[p.search.botModeMinBid] = () => p.search.enableBotMode ? back() : false;
                    b[p.search.botModeMinBuy] = () => p.search.enableBotMode ? back() : false;
                }
            }

            return b;
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

export default {
    run: run,
    order: 7,
    settings: {
        name: "snipe",
        title: 'plugins.snipe.settings.title',
        menu: menu
    }
};