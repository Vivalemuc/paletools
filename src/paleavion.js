(function () {
    document.body.onkeypress = e => {
        if (e.key === 't' || e.key === 'T') {
            var currentValue = parseInt($('.DetailPanel .auctionInfo .coins').text().replace(',', ''));
            if (!currentValue) return;
            var techAvion = currentValue + ((Math.floor(currentValue / 10000) - 1) * 1000) + 3500;
            if ($('.DetailPanel .techAvion').length > 0) return;
            $('.DetailPanel .auctionInfo').append('<div class=\'column\'><span class=\'secondary subHeading techAvion\'>Tech Avion</span><span class=\'coins subContent\'>' + techAvion + '</span></div>');
        }
    };
})();