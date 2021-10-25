export default buttons = {
    sendToTransferList: () => $(`.ut-button-group > button:contains('${loc.localize('infopanel.label.sendTradePile')}')`),
    sendToClub: () => $(`.ut-button-group > button:contains('${loc.localize('infopanel.label.storeInClub')}')`),
    discard: () => $(`.ut-button-group > button:contains('${loc.localize('infopanel.label.discard')}')`),
    buy: () => $('.buyButton'),
    back: () => $('.ut-navigation-button-control'),
    okAfterBuy: () => $('.ea-dialog-view .ut-button-group button:eq(0)'),
    search: () => $('.button-container .btn-standard.call-to-action'),
    decrementMinBid: () => $('.decrement-value'),
    incrementMinBid: () => $('.increment-value'),
    decrementMaxBid: () => $('.decrement-value:eq(1)'),
    incrementMaxBid: () => $('.increment-value:eq(1)'),
    decrementMinBuy: () => $('.decrement-value:eq(2)'),
    incrementMinBuy: () => $('.increment-value:eq(2)'),
    decrementMaxBuy: () => $('.decrement-value:eq(3)'),
    incrementMaxBuy: () => $('.increment-value:eq(3)'),
    resetBid: () => $('.search-price-header > button:first')
}