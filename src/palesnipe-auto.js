(function(decrementMinBidKey, 
    incrementMinBinKey, 
    decrementMaxBuyNowKey, 
    incrementMaxBuyNowKey, 
    backButtonKey, 
    searchButtonKey, 
    buyNowButtonKey, 
    sendToTransferListButtonKey,
    sendToClubButtonKey,
    toggleKey,
  ) {
    let actived = true;
    const getToClubBtn = () => $('.DetailPanel .ut-button-group button:nth-child(7)');
    const 
        dispatchMouseEvent = ($target, eventName) => {
            if($target.length == 0) return;
            const mouseEvent = document.createEvent('MouseEvents');
            mouseEvent.initEvent(eventName);
            $target[0].dispatchEvent(mouseEvent)
        },
        mouseDown = target => dispatchMouseEvent(target, 'mousedown'),
        mouseUp = target => dispatchMouseEvent(target, 'mouseup'),
        mouseClick = target => {
          if(actived) {
            mouseDown(target);
            mouseUp(target);
          }
        },
        keys = {
            [toggleKey]: () => actived = !actived,
            [decrementMinBidKey]: () => mouseClick($('.decrement-value')),
            [incrementMinBinKey]: () => mouseClick($('.increment-value')),
            [decrementMaxBuyNowKey]: () => mouseClick($('.decrement-value:eq(3)')),
            [incrementMaxBuyNowKey]: () => mouseClick($('.increment-value:eq(3)')),
            [backButtonKey]: () => {
              mouseClick($('.buyButton'));
              setTimeout(() => {
                mouseClick($('.Dialog.ui-dialog-type-message .ut-button-group button:first-of-type'))
                setTimeout(() => {
                  const toClubBtn = getToClubBtn();
                  const imTheWinner = !!toClubBtn[0]
                  if(imTheWinner) { 
                    mouseClick(toClubBtn);
                    setTimeout(() => mouseClick($('.ut-navigation-button-control')), 25);
                  }
                }, 25)
              }, 25)
				setTimeout(() => mouseClick($('.ut-navigation-button-control')), 95); 
			},
			
            [searchButtonKey]: () => mouseClick($('.button-container .btn-standard.call-to-action')), 
            [buyNowButtonKey]: () => {
              mouseClick($('.buyButton'));
              setTimeout(() => {
                mouseClick($('.Dialog.ui-dialog-type-message .ut-button-group button:first-of-type'))
                setTimeout(() => {
                  const toClubBtn = getToClubBtn();
                  const imTheWinner = !!toClubBtn[0]
                  if(imTheWinner) { 
                    mouseClick(toClubBtn);
                    setTimeout(() => mouseClick($('.ut-navigation-button-control')), 5);
                  }
                }, 10)
              }, 10)
            },
            [sendToTransferListButtonKey]: () => actived && mouseClick($(".ut-button-group > button:contains('" + window.services.Localization.localize('infopanel.label.sendTradePile') + "')")),
            [sendToClubButtonKey]: () => actived && mouseClick($(".ut-button-group > button:contains('" +  window.services.Localization.localize('infopanel.label.storeInClub') + "')"))
        };
    document.body.onkeydown = e => {
        if(!keys.hasOwnProperty(e.keyCode)) return;
        keys[e.keyCode]();
    };
})(37,39,40,38,49,50,51,52,53,80);