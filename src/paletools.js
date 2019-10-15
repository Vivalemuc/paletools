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
        transfer: 82,
        club: 67,
        pressEnter: true,
        autoBuy: false,
        sell: 81
    }
};

(function () {
    const ver = "v2.0";

    const map = ["","","","CANCEL","","","HELP","","BACK_SPACE","TAB","","","CLEAR","ENTER","ENTER_SPECIAL","","SHIFT","CONTROL","ALT","PAUSE","CAPS_LOCK","KANA","EISU","JUNJA","FINAL","HANJA","","ESCAPE","CONVERT","NONCONVERT","ACCEPT","MODECHANGE","SPACE","PAGE_UP","PAGE_DOWN","END","HOME","LEFT","UP","RIGHT","DOWN","SELECT","PRINT","EXECUTE","PRINTSCREEN","INSERT","DELETE","","0","1","2","3","4","5","6","7","8","9","COLON","SEMICOLON","LESS_THAN","EQUALS","GREATER_THAN","QUESTION_MARK","AT","A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z","OS_KEY","","CONTEXT_MENU","","SLEEP","NUMPAD0","NUMPAD1","NUMPAD2","NUMPAD3","NUMPAD4","NUMPAD5","NUMPAD6","NUMPAD7","NUMPAD8","NUMPAD9","MULTIPLY","ADD","SEPARATOR","SUBTRACT","DECIMAL","DIVIDE","F1","F2","F3","F4","F5","F6","F7","F8","F9","F10","F11","F12","F13","F14","F15","F16","F17","F18","F19","F20","F21","F22","F23","F24","","","","","","","","","NUM_LOCK","SCROLL_LOCK","WIN_OEM_FJ_JISHO","WIN_OEM_FJ_MASSHOU","WIN_OEM_FJ_TOUROKU","WIN_OEM_FJ_LOYA","WIN_OEM_FJ_ROYA","","","","","","","","","","CIRCUMFLEX","EXCLAMATION","DOUBLE_QUOTE","HASH","DOLLAR","PERCENT","AMPERSAND","UNDERSCORE","OPEN_PAREN","CLOSE_PAREN","ASTERISK","PLUS","PIPE","HYPHEN_MINUS","OPEN_CURLY_BRACKET","CLOSE_CURLY_BRACKET","TILDE","","","","","VOLUME_MUTE","VOLUME_DOWN","VOLUME_UP","","","SEMICOLON","EQUALS","COMMA","MINUS","PERIOD","SLASH","BACK_QUOTE","","","","","","","","","","","","","","","","","","","","","","","","","","","OPEN_BRACKET","BACK_SLASH","CLOSE_BRACKET","QUOTE","","META","ALTGR","","WIN_ICO_HELP","WIN_ICO_00","","WIN_ICO_CLEAR","","","WIN_OEM_RESET","WIN_OEM_JUMP","WIN_OEM_PA1","WIN_OEM_PA2","WIN_OEM_PA3","WIN_OEM_WSCTRL","WIN_OEM_CUSEL","WIN_OEM_ATTN","WIN_OEM_FINISH","WIN_OEM_COPY","WIN_OEM_AUTO","WIN_OEM_ENLW","WIN_OEM_BACKTAB","ATTN","CRSEL","EXSEL","EREOF","PLAY","ZOOM","","PA1","WIN_OEM_CLEAR",""];

    // If the script is already define, just return
    if (window.__paletools) return;

    let enabled = true;

    // Set variable to avoid a user from hitting the back button multiple times
    let backButtonLastDate = new Date();
    let shouldBuyNow = false;
    let shouldPressEnter = false;

    const
        BACK_BUTTON_THRESHOLD = 500, // throwhols to avoid multiple back button clicks
        p = window.paletools, // alias to save space
        loc = window.services.Localization, // alias to save space
        locPlayers = window.services.Localization.localize('search.filters.players'), // alias to save space
        locSquadFitness = window.services.Localization.localize('card.title.squadfitness'), // alias to save space
        locContracts = window.services.Localization.localize('card.title.contract'), //alias to save space
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
        getContract = (t) => $(".contracts", t).hasClass('rare') ? 'rare' : 'common',
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
            let selectedContract = $("#contracts").val();
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
                else if(selectedFilter === 'contracts') {
                    if(getContract(this) != selectedContract){
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

        buyNow = () =>{
            if(mouseClick($(".buyButton"))){
                if(p.results.pressEnter){
                    shouldPressEnter = true;
                }
            }
        },

        // clicks the buy now button 
        tryBuyNow = () => {
            let buyNow = $(".buyButton");
            if(!shouldBuyNow || buyNow.length == 0) return;
            buyNow();
            shouldBuyNow = false;
        },

        tryPressOkBtn = () => {
            let enter = $('.dialog-body .ut-button-group button:eq(0)')
            if(!shouldPressEnter || enter.length == 0) return;
            mouseClick(enter);
            shouldPressEnter = false;
        },

        search = () => {
            mouseClick($('.button-container .btn-standard.call-to-action'));
            if(p.results.autoBuy){
                shouldBuyNow = true;
            }
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

        transferBtn = () => $(".ut-button-group > button:contains('" + loc.localize('infopanel.label.sendTradePile') + "')"),
        clubBtn = () => $(".ut-button-group > button:contains('" + loc.localize('infopanel.label.storeInClub') + "')"),
        sellBtn = () => $(".ut-button-group > button:contains('" + loc.localize('infopanel.label.discard') + "')"),

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
                        b[p.results.transfer] = () => mouseClick(transferBtn());
                        b[p.results.club] = () => mouseClick(clubBtn());
                        b[p.results.sell] = () => mouseClick(sellBtn());
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

        // UI update
        updateUI = () => {
            let upd = (t, tx) => {
                if(!t) return;
                let add = ' [ ' + map[p.results[tx]] + ' ]';
                let html = t.html();
                if(html && html.indexOf(add) == -1){
                    t.html(t.html() + add);
                }
            }

            upd(transferBtn(), 'transfer');
            upd(clubBtn(), 'club');
            upd(sellBtn(), 'sell');
        },

        addCss = () => {
            let css = ""
            + ".search-prices .price-filter:nth-child(2) .decrement-value:after { font-size:10px; display:block; margin-top:-30px; content: '[ " + map[p.search.decMinBid] + " ]' }"
            + ".search-prices .price-filter:nth-child(2) .increment-value:after { font-size:10px; display:block; margin-top:-30px; content: '[ " + map[p.search.incMinBin] + " ]' }"
            + ".search-prices .price-filter:nth-child(3) .decrement-value:after { font-size:10px; display:block; margin-top:-30px; content: '[ " + map[p.search.decMaxBin] + " ]' }"
            + ".search-prices .price-filter:nth-child(3) .increment-value:after { font-size:10px; display:block; margin-top:-30px; content: '[ " + map[p.search.incMaxBin] + " ]' }"
            + ".search-prices .price-filter:nth-child(5) .decrement-value:after { font-size:10px; display:block; margin-top:-30px; content: '[ " + map[p.search.decMinBuy] + " ]' }"
            + ".search-prices .price-filter:nth-child(5) .increment-value:after { font-size:10px; display:block; margin-top:-30px; content: '[ " + map[p.search.incMinBuy] + " ]' }"
            + ".search-prices .price-filter:nth-child(6) .decrement-value:after { font-size:10px; display:block; margin-top:-30px; content: '[ " + map[p.search.decMaxBuy] + " ]' }"
            + ".search-prices .price-filter:nth-child(6) .increment-value:after { font-size:10px; display:block; margin-top:-30px; content: '[ " + map[p.search.incMaxBuy] + " ]' }"
            + ".ut-market-search-filters-view .call-to-action:after { content: '[ " + map[p.search.search] +  " ]' }"
            + ".ut-navigation-button-control:after { font-size:10px; float:right; margin-right:12px; content: '[ " + map[p.back] +  " ]' }"
            + ".pagingContainer .prev:after { font-size: 10px; display:block; content: '[ " + map[p.lists.prev] + " ]' }"
            + ".pagingContainer .next:after { font-size: 10px; display:block; content: '[ " + map[p.lists.next] + " ]' }";

            var style = document.createElement("style");
            style.type = "text/css";
            style.innerText = css;
            document.head.appendChild(style);
        },

        log = msg => {
            $("#log").val(new Date() + ':' + msg + "\n" + $("#log").val());
        };

    //header.append("<textarea id='log' style='position:absolute;bottom:0;left:0' rows='10' cols='200'></textarea>");

    // BEGIN: Attach Palefilter to the header
    let selectedFilter = 'player';
    $("<select style='height:46px'><option value='player'>" + locPlayers + "</option><option value='fitness'>" + locSquadFitness + "</option><option value='contracts'>" + locContracts + "</option></select>").change(function () {
        selectedFilter = this.value;
        playerAttrsContainer.hide();
        squadFitnessContainer.hide();
        contractsContainer.hide();
        if (this.value == 'player') {
            playerAttrsContainer.show();
        }
        else if(this.value === 'fitness') {
            squadFitnessContainer.show();
        }
        else if(this.value === 'contracts') {
            contractsContainer.show();
        }
    }).appendTo(header);

    let playerAttrsContainer = $("<div />").css("display", "inline-block").appendTo(header);
    for (var playerAttr in playerAttrs) {
        $('<input />').attr('id', '_' + playerAttr).attr('type', 'text').attr('style', 'width:52px').addClass('playerattr').attr('placeholder', playerAttr.toUpperCase()).appendTo(playerAttrsContainer);
    }

    let squadFitnessContainer = $("<select id='squadFitness' style='height:46px'><option value='+30'>+30</option><option value='+20'>+20</option><option value='+10'>+10</option></select>").appendTo(header).hide();
    let contractsContainer = $("<select id='contracts' style='height:46px'><option value='rare'>Rare</option><option value='common'>Common</option></select>").appendTo(header).hide();
    // END: Attach Palefilter to the header

    addCss();

    $(document.body).on('DOMSubtreeModified', function (ev) {
        tryToFilterItems(ev.target);
        tryBuyNow();
        tryPressOkBtn();
        updateUI();
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