import mouseClick from "../utils/mouse";
import localize from "../utils/localize";
import settings from "../settings";
import { on } from "../events";
import enableDisableApp from "../app";
import { addStyle, removeStyle } from "../utils/styles";

export default function runSnipe() {

    const
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
            if (!mouseClick(backBtn())) {
                setTimeout(back, 1);
            }
        },

        search = () => {
            mouseClick(searchBtn());
            if (_palesnipeSettings.buttons.results.autoBuy) {
                if (searchResults() == 0) {
                    setTimeout(search, 10);
                }
                else {
                    if ($(".ut-no-results-view").length > 0) {
                        back();
                    }
                    else {
                        buyNow((bought) => {
                            if (bought) {
                                mouseClick(transferBtn());
                            }
                        });
                    }
                }
            }
        },

        transferBtn = () => $(`.ut-button-group > button:contains('${localize('infopanel.label.sendTradePile')}')`),
        clubBtn = () => $(`.ut-button-group > button:contains('${localize('infopanel.label.storeInClub')}')`),
        sellBtn = () => $(`.ut-button-group > button:contains('${localize('infopanel.label.discard')}')`),
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
        },

        updateBoughtUI = () => {
            if (!settings.enabled) return;

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
        .buyButton:before { float:right; content: ' [ ${p.results.buy} ]' }`;

            addStyle('palesnipe-styles', css);
        },
        resetCss = () => {
            removeStyle('palesnipe-styles');
            addCss(settings.palesnipe.buttons);
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
        if (e.code === settings.palesnipe.buttons.enableDisable) {
            enableDisableApp();
        }

        if (!settings.enabled) return;

        let action = keys(p)[e.code];
        if (action) action();
    });

    addCss(settings.palesnipe.buttons);
}