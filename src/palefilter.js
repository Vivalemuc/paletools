(function () {
    if (window.__palefilter) return;

    window._0x1c1887 = function(){}

    const ver = "v1.2";
    const
        localePlayers = window.services.Localization.localize('search.filters.players'),
        localeSquadFitness = window.services.Localization.localize('card.title.squadfitness'),
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
        getSquadFitness = (t) => $('.name:contains(' + localeSquadFitness + ')', t).length > 0 ? $('.subtype', t)[0].textContent : null,
        header = $(".ut-fifa-header-view");

    let selectedFilter = 'player';
    $("<select style='height:46px'><option value='player'>" + localePlayers + "</option><option value='fitness'>" + localeSquadFitness + "</option></select>").change(function () {
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

    $('.view-root').on('DOMSubtreeModified', function (elem) {
        let items = $('.listFUTItem', elem.target);
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

        items = $('.listFUTItem', elem.target);
        if (items.length > 0) {
            setTimeout(function () {
                mouseClick(items);
            }, 0);
        }

    });

    $("nav.ut-tab-bar").append('<button class="ut-tab-bar-item" style="order: 6"><a style="text-decoration:none;color:inherit" target="paletools" href="http://eallegretta.github.io/paletools.html">Palefilter ' + ver + '</a>');
    window.__palefilter = true;
})();