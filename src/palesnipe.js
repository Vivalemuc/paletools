window.palesnipe = window.palesnipe || {
    decrementMinBidKey: 37,
    incrementMinBinKey: 39,
    decrementMaxBinKey: 98,
    incrementMaxBinKey: 104,
    decrementMinBuyNowKey: 100,
    incrementMinBuyNowKey: 102,
    decrementMaxBuyNowKey: 40,
    incrementMaxBuyNowKey: 38,
    backButtonKey: 49,
    searchButtonKey: 50,
    buyNowButtonKey: 51,
    sendToTransferListButtonKey: 52,
    sendToClubButtonKey: 53,
    autoPressEnterAfterBuyNow: true,
    autoBuyAfterSearch: false,
    enableDisablePalesnipeKey: 9
};

(function () {
    const ver = "v1.5";

    if (window.__palesnipe) return;

    window._0x1c1887 = function () { }

    let p = window.palesnipe;
    let loc = window.services.Localization;
    let enabled = true;
    let backButtonLastDate = new Date();

    const
        BACK_BUTTON_THRESHOLD = 500,
        dispatchMouseEvent = ($target, eventName) => {
            if ($target.length == 0) return;
            const mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initEvent(eventName);
            $target[0].dispatchEvent(mouseEvent)
        },
        mouseDown = target => dispatchMouseEvent(target, 'mousedown'),
        mouseUp = target => dispatchMouseEvent(target, 'mouseup'),
        mouseClick = target => {
            mouseDown(target);
            mouseUp(target);
        },
        buyNow = (timeout) => {
            function buy(){
                mouseClick($('.buyButton'));
                if (p.autoPressEnterAfterBuyNow) {
                    pressOkBtn();
                }
            }

            if (timeout) {
                setTimeout(buy, timeout)
                return;
            }

            buy();
        },
        pressOkBtn = () => setTimeout(() => mouseClick($('.dialog-body .ut-button-group button:eq(0)')), 100),
        keys = {
            [p.decrementMinBidKey]: () => mouseClick($('.decrement-value')),
            [p.incrementMinBinKey]: () => mouseClick($('.increment-value')),
            [p.decrementMaxBinKey]: () => mouseClick($('.decrement-value:eq(1)')),
            [p.incrementMaxBinKey]: () => mouseClick($('.increment-value:eq(1)')),
            [p.decrementMinBuyNowKey]: () => mouseClick($('.decrement-value:eq(2)')),
            [p.incrementMinBuyNowKey]: () => mouseClick($('.increment-value:eq(2)')),
            [p.decrementMaxBuyNowKey]: () => mouseClick($('.decrement-value:eq(3)')),
            [p.incrementMaxBuyNowKey]: () => mouseClick($('.increment-value:eq(3)')),
            [p.backButtonKey]: () => {
                if (new Date() - backButtonLastDate < BACK_BUTTON_THRESHOLD) {
                    return;
                }
                backButtonLastDate = new Date();
                mouseClick($('.ut-navigation-button-control'));
            },
            [p.searchButtonKey]: () => {
                mouseClick($('.button-container .btn-standard.call-to-action'));
                if(p.autoBuyAfterSearch){
                    buyNow(100);
                }
            },
            [p.buyNowButtonKey]: () => buyNow(),
            [p.sendToTransferListButtonKey]: () => mouseClick($(".ut-button-group > button:contains('" + loc.localize('infopanel.label.sendTradePile') + "')")),
            [p.sendToClubButtonKey]: () => mouseClick($(".ut-button-group > button:contains('" + loc.localize('infopanel.label.storeInClub') + "')")),
        };

    document.body.onkeydown = e => {
        if (e.keyCode == p.enableDisablePalesnipeKey) {
            enabled = !enabled;
            if (enabled) {
                $("#paletools-status").removeClass('off').addClass('on').text('ON');
            }
            else {
                $("#paletools-status").removeClass('on').addClass('off').text('OFF');
            }
        }

        if (!enabled || !keys.hasOwnProperty(e.keyCode)) {
            return;
        }

        keys[e.keyCode]();
    };

    const
        css = "#paletools-status.on { color: green }; #paletools-status.off { color: red };",
        head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));

    let donateHtml = '<form id="paletools-donate" action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_blank">\
    <input type="hidden" name="cmd" value="_donations" />\
    <input type="hidden" name="business" value="ZAJX6AD6XPLRN" />\
    <input type="hidden" name="currency_code" value="USD" />\
    <a style="text-decoration:none;color:inherit" onclick="javascript:$(\'#paletools-donate\')[0].submit()" href="javascript:void(0)">Paletools Donate</a></form></a>';

    $("nav.ut-tab-bar")
        .append('<button class="ut-tab-bar-item" style="order: 7"><a style="text-decoration:none;color:inherit" target="paletools" href="http://eallegretta.github.io/paletools.html">Palesnipe ' + ver + ' <span id="paletools-status" class="on">ON</span></a></button>')
        .append('<button class="ut-tab-bar-item" style="order: 7">' + donateHtml + '</button>');

    window.__palesnipe = true;
})();
