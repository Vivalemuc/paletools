(function(){
    let state = {};

    fetch("https://utas.external.s2.fut.ea.com/ut/game/fifa21/usermassinfo", {
        headers: {
        "X-UT-SID": services.Authentication.getUtasSession()["id"]
    }})
    .then(response => response.json())
    .then(usermassinfo => 
        {
            state.unassignedPileSize =usermassinfo.userInfo.unassignedPileSize;
            fetch("https://utas.external.s2.fut.ea.com/ut/game/fifa21/watchlist", {
                headers: {
                "X-UT-SID": services.Authentication.getUtasSession()["id"]
            }})
            .then(response => response.json())
            .then(watchlist => 
                {
                    state.watchlist = watchlist.total;
                    alert(`Limbo: ${state.unassignedPileSize}\nWatchlist Limbo: ${state.watchlist}`);
                });
        });
})();