// MIT License
//
// Copyright (c) 2019 - Paleta
//
// http://github.com/eallegretta/paletools
//
// Permission is hereby granted, free of charge, to any person obtaining a copy
// of this software and associated documentation files (the "Software"), to deal
// in the Software without restriction, including without limitation the rights
// to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
// copies of the Software, and to permit persons to whom the Software is
// furnished to do so, subject to the following conditions:
//
// The above copyright notice and this permission notice shall be included in all
// copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
// IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
// FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
// AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
// LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
// OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
// SOFTWARE.

// Define default commands, this allows for simpler customzation
window.paletools = window.paletools || {
    back: 49,
    enableDisable: 9,
    tech: 84,
    lists: {
        up: 38,
        down: 40,
        prev: 37,
        next: 39,
    },
    search: {
        decMinBid: 37,
        incMinBin: 39,
        decMaxBin: 35,
        incMaxBin: 36,
        decMinBuy: 46,
        incMinBuy: 34,
        decMaxBuy: 40,
        incMaxBuy: 38,
        search: 50
    },
    results: {
        bid: 52,
        buy: 51,
        transfer: 53,
        club: 54,
        pressEnter: true,
        autoBuy: false,
    }
};

(function () {
    const ver = "v2.0";

    // If the script is already define, just return
    if (window.__paletools) return;

    let enabled = true;

    // Set variable to avoid a user from hitting the back button multiple times
    let backButtonLastDate = new Date();

    const
        BACK_BUTTON_THRESHOLD = 500, // throwhols to avoid multiple back button clicks
        p = window.paletools, // alias to save space
        loc = window.services.Localization, // alias to save space
        locPlayers = window.services.Localization.localize('search.filters.players'), // alias to save space
        locSquadFitness = window.services.Localization.localize('card.title.squadfitness'), // alias to save space
        dispatchMouseEvent = ($target, eventName) => {
            if ($target.length == 0) return false;
            const mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initEvent(eventName);
            $target[0].dispatchEvent(mouseEvent);
            return true;
        },
        mouseDown = target => dispatchMouseEvent(target, 'mousedown'),
        mouseUp = target => dispatchMouseEvent(target, 'mouseup'),
        mouseClick = target => {
            return mouseDown(target) && mouseUp(target);
        },

        // Palefilter logic
        getPlayerStat = (t, e) => $('.player-stats-data-component .value', t)[e].textContent,
        playerAttrs = {
            ovr: t => $('.rating', t)[0].textContent,
            pac: t => getPlayerStat(t, 0),
            sho: t => getPlayerStat(t, 1),
            pas: t => getPlayerStat(t, 2),
            dri: t => getPlayerStat(t, 3),
            def: t => getPlayerStat(t, 4),
            phy: t => getPlayerStat(t, 5)
        },
        getSquadFitness = (t) => $('.name:contains(' + locSquadFitness + ')', t).length > 0 ? $('.subtype', t)[0].textContent : null,
        header = $(".ut-fifa-header-view"),

        tryToFilterItems = (container) => {
            let items = $('.listFUTItem', container);
            if (items.length == 0) return;
            let selectedSquadFitness = $("#squadFitness").val();
            items.each(function () {
                if (selectedFilter === 'player') {
                    for (var playerAttr in playerAttrs) {
                        var attrValue = $('#_' + playerAttr).val();
                        if (attrValue && playerAttrs[playerAttr](this) != attrValue) {
                            $(this).remove();
                        }
                    }
                }
                else if (selectedFilter === 'fitness') {
                    if (getSquadFitness(this) != selectedSquadFitness) {
                        $(this).remove();
                    }
                }
            });

            items = $('.listFUTItem', container);
            if (items.length > 0) {
                setTimeout(function () {
                    mouseClick(items);
                }, 0);
            }
        }

        // clicks the buy now button 
        buyNow = () => {
            if (mouseClick($('.buyButton'))) {
                if (p.results.pressEnter) {
                    pressOkBtn();
                }
            }
            else {
                setTimeout(buyNow, 10);
            }
        },

        pressOkBtn = () => {
            if (!mouseClick($('.dialog-body .ut-button-group button:eq(0)'))) {
                setTimeout(pressOkBtn, 25);
            }
        },

        search = () => {
            mouseClick($('.button-container .btn-standard.call-to-action'));
        },

        back = () => {
            if (new Date() - backButtonLastDate < BACK_BUTTON_THRESHOLD) {
                return;
            }
            backButtonLastDate = new Date();
            if (!mouseClick($('.ut-navigation-button-control'))) {
                setTimeout(back, 10);
            }
        },

        // tech avion
        tech = () => {
            let currentValue = parseInt($('.DetailPanel .auctionInfo .currency-coins').text().replace(',', '').replace('.', ''));
            if (!currentValue || $('.DetailPanel .techAvion').length > 0) return;
            let techAvion = currentValue + ((Math.floor(currentValue / 10000) - 1) * 1000) + 3500;
            $('.DetailPanel .auctionInfo').append('<div class=\'column\'><span class=\'secondary subHeading techAvion\'>Tech Avion</span><span class=\'coins subContent\'>' + techAvion + '</span></div>');
        },

        keys = () => {
            try {
                let b = {};

                if ($(".ut-market-search-filters-view").length > 0) {
                    b[p.search.decMinBid] = () => mouseClick($('.decrement-value'));
                    b[p.search.incMinBin] = () => mouseClick($('.increment-value'));
                    b[p.search.decMaxBin] = () => mouseClick($('.decrement-value:eq(1)'));
                    b[p.search.incMaxBin] = () => mouseClick($('.increment-value:eq(1)'));
                    b[p.search.decMinBuy] = () => mouseClick($('.decrement-value:eq(2)'));
                    b[p.search.incMinBuy] = () => mouseClick($('.increment-value:eq(2)'));
                    b[p.search.decMaxBuy] = () => mouseClick($('.decrement-value:eq(3)'));
                    b[p.search.incMaxBuy] = () => mouseClick($('.increment-value:eq(3)'));
                    b[p.search.search] = () => search();
                }
                else {
                    let itemsExists = $(".listFUTItem").length > 0;
                    if (itemsExists && $(".DetailPanel > .bidOptions").length > 0) {
                        b[p.results.bid] = () => mouseClick($('.bidButton'));
                        b[p.results.buy] = () => buyNow();
                    }

                    if (itemsExists && $(".DetailPanel > .ut-button-group").length > 0) {
                        b[p.results.transfer] = () => mouseClick($(".ut-button-group > button:contains('" + loc.localize('infopanel.label.sendTradePile') + "')"));
                        b[p.results.club] = () => mouseClick($(".ut-button-group > button:contains('" + loc.localize('infopanel.label.storeInClub') + "')"));
                    }

                    if (itemsExists) {
                        b[p.lists.up] = () => mouseClick($(".listFUTItem.selected").prev());
                        b[p.lists.down] = () => mouseClick($(".listFUTItem.selected").next());
                    }

                    if ($(".pagingContainer")) {
                        b[p.lists.prev] = () => mouseClick($(".pagingContainer .prev:visible"));
                        b[p.lists.next] = () => mouseClick($(".pagingContainer .next:visible"));
                    }
                }

                return b;
            }
            catch (e) {
                log(e);
            }
        },

        log = msg => {
            $("#log").val(new Date() + ':' + msg + "\n" + $("#log").val());
        };

    let selectedFilter = 'player';
    $("<select style='height:46px'><option value='player'>" + locPlayers + "</option><option value='fitness'>" + locSquadFitness + "</option></select>").change(function () {
        selectedFilter = this.value;
        if (this.value == 'player') {
            playerAttrsContainer.show();
            squadFitnessContainer.hide();
        }
        else {
            playerAttrsContainer.hide();
            squadFitnessContainer.show();
        }
    }).appendTo(header);

    let playerAttrsContainer = $("<div />").css("display", "inline-block").appendTo(header);
    for (var playerAttr in playerAttrs) {
        $('<input />').attr('id', '_' + playerAttr).attr('type', 'text').attr('style', 'width:52px').addClass('playerattr').attr('placeholder', playerAttr.toUpperCase()).appendTo(playerAttrsContainer);
    }

    let squadFitnessContainer = $("<select id='squadFitness' style='height:46px'><option value='+30'>+30</option><option value='+20'>+20</option><option value='+10'>+10</option></select>").appendTo(header).hide();

    $(document.body).on('DOMSubtreeModified', function (elem) {

        tryToFilterItems();

        
    });

    document.body.onkeydown = e => {
        if (e.keyCode == p.enableDisable) {
            enabled = !enabled;
            $("#paletools-status").css("color", enabled ? "green" : "red").text(enabled ? "ON" : "OFF");
        }

        if (!enabled) {
            return;
        }

        if (e.keyCode == p.back) {
            back();
            return;
        }

        if (e.keyCode == p.tech) {
            tech();
            return;
        }

        try {
            let action = keys()[e.keyCode];
            if (action) action();
        }
        catch (e) {
            log(e)
        }
    };

    let donateHtml = '<form id="paletools-donate" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">\
    <input type="hidden" name="cmd" value="_donations" />\
    <input type="hidden" name="business" value="ZAJX6AD6XPLRN" />\
    <input type="hidden" name="currency_code" value="USD" />\
    <a style="text-decoration:none;color:inherit" onclick="javascript:$(\'#paletools-donate\')[0].submit()" href="javascript:void(0)">Paletools Donate</a></form></a>';

    $("nav.ut-tab-bar")
        .append('<button class="ut-tab-bar-item" style="order: 7"><a style="text-decoration:none;color:inherit" target="paletools" href="http://eallegretta.github.io/paletools.html">Palesnipe ' + ver + ' <span id="paletools-status" style="color:green">ON</span></a></button>')
        .append('<button class="ut-tab-bar-item" style="order: 7">' + donateHtml + '</button>');

    window.__paletools = true;
})();
