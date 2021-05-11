(function(){
    const VERSION = "v1.2";

    let state = {};

    fetch(`${services.Authentication.sessionUtas.url}/ut/game/fifa21/usermassinfo`, {
        headers: {
        "X-UT-SID": services.Authentication.getUtasSession()["id"]
    }})
    .then(response => response.json())
    .then(usermassinfo => 
        {
            state.unassignedPileSize =usermassinfo.userInfo.unassignedPileSize;
            fetch(`${services.Authentication.sessionUtas.url}/ut/game/fifa21/watchlist`, {
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