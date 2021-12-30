(function (buttons) {
    const ver = "v1.0";

    let backButtonLastDate = new Date();
    let backButtonPressedOnResult = false;

    const
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
        mouseClick = target => {
            return mouseDown(target) && mouseUp(target);
        },
        buyNow = () => {
            if (mouseClick($('.buyButton'))) {
                if (p.results.pressEnter) {
                    tryPressOkBtn();
                }
            }
        },
        tryPressOkBtn = () => {
            let enter = $('.dialog-body .ut-button-group button:eq(0)')
            if (!mouseClick(enter)) {
                setTimeout(tryPressOkBtn, 10);
                return;
            }
            backButtonPressedOnResult = false;
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

        decMinBid = () => mouseClick($('.decrement-value')),
        incMinBid = () => mouseClick($('.increment-value')),
        decMaxBid = () => mouseClick($('.decrement-value:eq(1)')),
        incMaxBid = () => mouseClick($('.increment-value:eq(1)')),
        decMinBuy = () => mouseClick($('.decrement-value:eq(2)')),
        incMinBuy = () => mouseClick($('.increment-value:eq(2)')),
        decMaxBuy = () => mouseClick($('.decrement-value:eq(3)')),
        incMaxBuy = () => mouseClick($('.increment-value:eq(3)')),
        search = () => mouseClick($('.button-container .btn-standard.call-to-action'));

})();
