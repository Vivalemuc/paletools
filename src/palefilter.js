(function() {
    if(window.__palefilter) return;

    const ver = "v1.0";

    const dispatchMouseEvent = ($target, eventName) => {
            if($target.length == 0) return;
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
        header = $("#FIFAHeader");
        
    for (var playerAttr in playerAttrs) {
        $('<input />').attr('id', '_' + playerAttr).attr('type', 'text').attr('style', 'width:52px').attr('placeholder', playerAttr.toUpperCase()).appendTo(header)
    }

    $('.view-root').on('DOMSubtreeModified', function(elem) {
        var items = $('.listFUTItem', elem.target);
        items.each(function() {
            for (var playerAttr in playerAttrs) {
                var attrValue = $('#_' + playerAttr).val();
                if(playerAttrs[playerAttr](this)!= attrValue){
                    $(this).remove();
                }
            }
        });
        if (items.length > 0) {
            mouseClick(items);
        }
    })

    window.__palefilter = true;
})();