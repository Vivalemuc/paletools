(function () {
    if (window.__paleavion) return;

    window._0x1c1887 = function(){}

    const ver = "v1.1";
    document.body.onkeypress = e => {
        if (e.key === 't' || e.key === 'T') {
            var currentValue = parseInt($('.DetailPanel .auctionInfo .coins').text().replace(',', '').replace('.',''));
            if (!currentValue) return;
            var techAvion = currentValue + ((Math.floor(currentValue / 10000) - 1) * 1000) + 3500;
            if ($('.DetailPanel .techAvion').length > 0) return;
            $('.DetailPanel .auctionInfo').append('<div class=\'column\'><span class=\'secondary subHeading techAvion\'>Tech Avion</span><span class=\'coins subContent\'>' + techAvion + '</span></div>');
        }
    };

    $("nav.ut-tab-bar").append('<button class="ut-tab-bar-item" style="order: 6"><a style="text-decoration:none;color:inherit" target="paletools" href="http://eallegretta.github.io/paletools.html">Paleavion ' + ver + '</a>');
    window.__paleavion = true;
})();