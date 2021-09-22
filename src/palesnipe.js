(function (buttons) {
    const VERSION = "v1.9.2";

    buttons = $.extend({
        back: 49,
        enableDisable: 92,
        lists: {
            up: 38,
            down: 40,
            prev: 37,
            next: 39,
        },
        search: {
            decMinBid: 37,
            incMinBid: 39,
            decMaxBid: 35,
            incMaxBid: 36,
            decMinBuy: 46,
            incMinBuy: 34,
            decMaxBuy: 40,
            incMaxBuy: 38,
            search: 50
        },
        results: {
            bid: 52,
            buy: 51,
            transfer: 82,
            club: 67,
            pressEnter: true,
            autoBuy: false,
            preventBack: false,
            sell: 81,
            decBid: 46,
            incBid: 34
        }
    }, buttons || {});
    let p = buttons;
    let enabled = true;
    let backButtonLastDate = new Date();
    let backButtonPressedOnResult = false;

    // reset console
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    window.console = iframe.contentWindow.console;

    window.MAX_NEW_ITEMS = Number.MAX_VALUE;

    const
        l = console.log,
        loc = window.services.Localization,
        BACK_BUTTON_THRESHOLD = 500,
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
            if(delay){
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
                if(callback){
                    setTimeout(callback(false), 0);
                }
                
                setTimeout(tryPressOkBtn, 10);
                return;
            }
            else {
                if(callback){
                    callback(true);
                }
            }
        },
        back = () => {
            l('back');
            // force double back when there is a card on the list
            // if (new Date() - backButtonLastDate < BACK_BUTTON_THRESHOLD) {
            //     return;
            // }
            // backButtonLastDate = new Date();
            if (!mouseClick(backBtn())) {
                setTimeout(back, 1);
            }
        },

        search = () => {
            mouseClick(searchBtn());
            if(p.results.autoBuy){
                if(searchResults() == 0){
                    l('researching');
                    setTimeout(search, 10);
                }
                else {
                    l($(".ut-no-results-view").length);
                    if($(".ut-no-results-view").length > 0){
                        l('no results');
                        back();
                    }
                    else {
                        l('buying');
                        buyNow((bought) => {
                            if(bought){
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
        enterBtn = () =>$('.ea-dialog-view .ut-button-group button:eq(0)'),
        searchBtn = () => $('.button-container .btn-standard.call-to-action'),
        searchResults = () =>$('.SearchResults').length,

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
                        if(selected.length === 0){
                            selected = $(".listFUTItem:last-child", container);
                        }
                        mouseClick(selected);
                        container.css('position', 'relative');
                        container.scrollTop(container.scrollTop() + selected.position().top - selected.height());
                    };
                    b[p.lists.down] = () => {
                        let container = itemsContainer;
                        let selected = $('.listFUTItem.selected', container).next();
                        if(selected.length === 0){
                            selected = $(".listFUTItem:first-child", container);
                        }
                        mouseClick(selected);
                        container.css('position', 'relative');
                        container.scrollTop(container.scrollTop() + selected.position().top);
                    };
                }

                if ($('.pagingContainer').length > 0) {
                    b[p.lists.prev] = () => mouseClick($('.pagingContainer .prev:visible'));
                    b[p.lists.next] = () => mouseClick($('.pagingContainer .next:visible'));
                }
            }

            return b;
        };

    document.body.addEventListener('keydown', e => {
        if (e.keyCode == p.enableDisable) {
            enabled = !enabled;
        }

        if (!enabled) {
            return;
        }

        let action = keys()[e.keyCode];
        if (action) action();
    });
})();
