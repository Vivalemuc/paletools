/// #if process.env.CLUB_ANALYZER

import localize from "../../localization";
import { getAllClubPlayers } from "../../services/club";
import http from "../../services/http";
import { ClubAnalyzerView } from "./ClubAnalyzerView";
import ClubAnalyzerViewModel from "./ClubAnalyzerViewModel";

export function ClubAnalyzerController(t) {
    UTViewController.call(this);
    this._viewmodel = new ClubAnalyzerViewModel();
};

JSUtils.inherits(ClubAnalyzerController, UTViewController);

ClubAnalyzerController.prototype._getViewInstanceFromData = function () {
    return new ClubAnalyzerView();
}

ClubAnalyzerController.prototype.init = function () {
    if (!this.initialized) {
        this.getView().onReloadClicked.observe(this, this._reload);
        this.getView().onExportCsvClicked.observe(this, this._exportCsv);
        this.getView().onExportHtmlClicked.observe(this, this._exportHtml);
        this.initialized = true;
    }
}

ClubAnalyzerController.prototype.viewDidAppear = function () {
    this.getNavigationController().setNavigationVisibility(true, true);
    this._reload();
}

ClubAnalyzerController.prototype.getNavigationTitle = function () {
    return localize("plugins.clubAnalyzer.settings.title");
}

ClubAnalyzerController.prototype._reload = function () {
    const self = this;
    function loadingCallback(type, data) {
        let msg = localize(`plugins.clubAnalyzer.view.loading.${type}`).replace("#COUNT#", data);
        self.getView().showLoading(msg)
    }

    this.getView().prepareForUpdate();
    analyzeClub(loadingCallback).then(viewmodel => {
        this._viewmodel = viewmodel;
        this.getView().hideLoading();
        this.getView().update(this._viewmodel);
    });
}

ClubAnalyzerController.prototype._exportCsv = function () {
    exportClubAnalyzer(
        this._viewmodel,
        null,
        fields => `${fields.join(',')}\n`,
        fields => `${fields.join(',')}\n`,
        null,
        'club-analyzer.csv',
        'text/csv;encoding:utf-8');
}

ClubAnalyzerController.prototype._exportHtml = function () {
    exportClubAnalyzer(
        this._viewmodel,
        () => '<table>',
        fields => {
            let output = '<tr>';
            for (let field of fields) {
                output += `<th>${field}</th>`
            }
            output += '</tr>';
            return output;
        },
        fields => {
            let output = '<tr>';
            for (let field of fields) {
                output += `<td>${field}</td>`
            }
            output += '</tr>';
            return output;
        },
        () => '<table>',
        'club-analyzer.html',
        'text/html;encoding:utf-8');
}

function getTeamName(id) {
    return localize(`global.teamabbr15.${window.APP_YEAR}.team${id}`);
}

function getLeagueName(id) {
    return localize(`global.leagueFull.${window.APP_YEAR}.league${id}`);
}

function getNationName(id) {
    return localize(`search.nationName.nation${id}`);
}

function getRarity(id) {
    return localize(`item.raretype${id}`);
}

function getPlayStyle(id) {
    return localize(`playstyles.playstyle${id}`);
}

function analyzeClub(loadingCallback) {
    let players, usermassinfo, tradepile, watchlist;

    return new Promise((resolve) => {
        loadingCallback("players", 0);
        getAllClubPlayers(null, null, count => loadingCallback("players", count))
            .then(p => {
                players = p;
                loadingCallback("usermassinfo");
                http('usermassinfo').then(umi => {
                    usermassinfo = umi;

                    loadingCallback("tradepile");
                    http('tradepile').then(tp => {
                        tradepile = tp;

                        loadingCallback("watchlist");
                        http('watchlist').then(wl => {
                            watchlist = wl;

                            let allPlayerNames = {
                                players: {}
                            };

                            loadingCallback("process");
                            const viewmodel = processClub(allPlayerNames, players, usermassinfo, tradepile, watchlist);
                            resolve(viewmodel);
                        });
                    });

                });
            })
    });
};

function processClub(allPlayerNames, players, usermassinfo, tradepile, watchlist) {
    const viewmodel = {
        players: {
            all: {},
            byNation: {},
            byLeague: {},
            byRating: {},
            byRarity: {},
            unnasigned: {
                all: {},
                tradeable: {},
                untradeable: {}
            },
            tradepile: {},
            watchlistWon: {},
            watchlistWinning: {},
            watchlistLoosing: {},
            watchlistLost: {}
        },
        counters: {
            special: 0,
            rare: {
                gold: 0,
                silver: 0,
                bronze: 0,
                ucl: 0
            },
            common: {
                gold: 0,
                silver: 0,
                bronze: 0,
                ucl: 0
            },
            libertadores: {
                gold: 0,
                silver: 0,
                bronze: 0
            },
            sudamericana: {
                gold: 0,
                silver: 0,
                bronze: 0
            },
            unnasignedTotal: 0,
            watchlistTotal: 0,
            tradepileTotal: 0
        }
    };

    const processPlayers = (players, destination, getPlayer, condition, shouldAddToCounters) => {
        for (let player of players) {
            if (typeof condition !== "undefined") {
                if (!condition(player)) {
                    continue;
                }
            }

            const data = getPlayer(player);

            if (shouldAddToCounters) {
                addToCounters(data);
            }

            if (!destination[data.definitionId]) {
                destination[data.definitionId] = {
                    players: [data],
                    data: { f: data._staticData.firstName, l: data._staticData.lastName },
                    count: 1,
                    sumPrices: data.lastSalePrice,
                    rating: data.rating,
                    rarity: getRarity(data.rareflag),
                    nation: getNationName(data.nationId),
                    team: getTeamName(data.teamid),
                    league: getLeagueName(data.leagueId)
                }
            }
            else {
                destination[data.definitionId].count++;
                destination[data.definitionId].sumPrices += data.lastSalePrice;
                destination[data.definitionId].players.push(data);
            }
        }

    }

    const addToCounters = player => {
        if (player.hasOwnProperty("loans") && player.loans > 0) {
            return;
        }

        switch (player.rareflag) {
            case 0:
            case 1:
            case 52:
            case 53:
                const rarity = player.rareflag == 0 ? "common" : player.rareflag == 1 ? "rare" : player.rareflag == 52 ? "sudamericana" : "libertadores";
                if (player.rating <= 64) {
                    viewmodel.counters[rarity].bronze++;
                }
                else if (player.rating > 64 && player.rating <= 74) {
                    viewmodel.counters[rarity].silver++;
                }
                else {
                    viewmodel.counters[rarity].gold++;
                }
                break;
            case 47:
                viewmodel.counters.common.ucl++;
                break;
            case 48:
                viewmodel.counters.rare.ucl++;
                break;
            default:
                viewmodel.counters.special++;
                break;
        }
    };

    viewmodel.counters.unnasignedTotal = usermassinfo.userInfo.unassignedPileSize;
    viewmodel.counters.watchlistTotal = watchlist.total;
    viewmodel.counters.tradepileTotal = tradepile.auctionInfo.length;

    const itemFactory = new UTItemEntityFactory();

    function overrideItemData(arr, selector) {
        for (let index = 0; index < arr.length; index++) {
            if (selector) {
                arr[index][selector] = itemFactory.createItem(arr[index][selector]);
            }
            else {
                arr[index] = itemFactory.createItem(arr[index]);
            }
        }
    }

    overrideItemData(usermassinfo.purchasedItems.itemData);
    overrideItemData(tradepile.auctionInfo, "itemData");
    overrideItemData(watchlist.auctionInfo, "itemData");

    processPlayers(usermassinfo.purchasedItems.itemData, viewmodel.players.unnasigned.all, x => x, undefined, true);
    processPlayers(usermassinfo.purchasedItems.itemData.filter(x => !x.untradeable), viewmodel.players.unnasigned.tradeable, x => x, undefined, true);
    processPlayers(usermassinfo.purchasedItems.itemData.filter(x => x.untradeable), viewmodel.players.unnasigned.untradeable, x => x, undefined, true);
    processPlayers(tradepile.auctionInfo, viewmodel.players.tradepile, x => x.itemData, undefined, true);
    processPlayers(watchlist.auctionInfo, viewmodel.players.watchlistWon, x => x.itemData, x => x.bidState === "highest" && x.tradeState === "closed", true);
    processPlayers(watchlist.auctionInfo, viewmodel.players.watchlistWinning, x => x.itemData, x => x.bidState === "highest" && x.tradeState !== "closed");
    processPlayers(watchlist.auctionInfo, viewmodel.players.watchlistLoosing, x => x.itemData, x => x.bidState === "outbid" && x.tradeState !== "closed");
    processPlayers(watchlist.auctionInfo, viewmodel.players.watchlistLost, x => x.itemData, x => x.bidState === "outbid" && x.tradeState === "closed");

    for (let player of players) {
        viewmodel.players.all[player.definitionId] = player;
        player.data = { f: player._staticData.firstName, l: player._staticData.lastName };

        const rarity = getRarity(player.rareflag);

        addToCounters(player);

        viewmodel.players.byRarity[rarity] = viewmodel.players.byRarity[rarity] || [];
        viewmodel.players.byRarity[rarity].push(player);

        viewmodel.players.byRating[player.rating] = viewmodel.players.byRating[player.rating] || { players: [], by: {} };
        viewmodel.players.byRating[player.rating].by[rarity] = viewmodel.players.byRating[player.rating].by[rarity] || [];
        viewmodel.players.byRating[player.rating].players.push(player);
        viewmodel.players.byRating[player.rating].by[rarity].push(player);

        const nation = getNationName(player.nationId);

        viewmodel.players.byNation[nation] = viewmodel.players.byNation[nation] || { players: [], by: {} };
        viewmodel.players.byNation[nation].by[rarity] = viewmodel.players.byNation[nation].by[rarity] || [];
        viewmodel.players.byNation[nation].players.push(player);
        viewmodel.players.byNation[nation].by[rarity].push(player);

        const league = getLeagueName(player.leagueId);
        const team = getTeamName(player.teamId);

        viewmodel.players.byLeague[league] = viewmodel.players.byLeague[league] || { players: [], by: {} };
        viewmodel.players.byLeague[league].by[team] = viewmodel.players.byLeague[league].by[team] || { players: [], by: {} };
        viewmodel.players.byLeague[league].by[team].by[rarity] = viewmodel.players.byLeague[league].by[team].by[rarity] || [];
        viewmodel.players.byLeague[league].players.push(player);
        viewmodel.players.byLeague[league].by[team].players.push(player);
        viewmodel.players.byLeague[league].by[team].by[rarity].push(player);
    }

    return viewmodel;
}

function exportClubAnalyzer(viewmodel, startRenderer, headerRenderer, dataRenderer, endRenderer, filename, mimeType) {
    return new Promise((resolve) => {
        let csvContent = '';
        //lastname, name, rating, rarity, position, country, league, club, untradeable, loans, bought for, is on transfer list, is on watchlist

        csvContent += startRenderer ? startRenderer() : '';
        csvContent += headerRenderer(['Id', 'Lastname', 'Name', 'Rating', 'Position', 'Rarity', 'Skill Moves', 'Weak Foot', 'Chemistry', 'Country', 'League', 'Club', 'Untradeable', 'Loans', 'Bought For', 'Price Range', 'Discard Value', 'Location']);

        // Add Club
        for (let key of Object.keys(viewmodel.players.all)) {
            let player = viewmodel.players.all[key];
            csvContent += dataRenderer([player.definitionId, player.data.l, player.data.f, player.rating, player.preferredPosition, getRarity(player.rareflag), player._skillMoves + 1, player._weakFoot, getPlayStyle(player.playStyle), getNationName(player.nationId), getLeagueName(player.leagueId), getTeamName(player.teamId), player.untradeable || false, player.loans > -1 ? player.loans : 0, player.lastSalePrice, `${player._itemPriceLimits ? player._itemPriceLimits.minimum : ''}-${player._itemPriceLimits ? player._itemPriceLimits.maximum : ''}`, player.discardValue, "CLUB"]);
        }

        const lists = { "UNASSIGNED": viewmodel.players.unnasigned.all, "WATCHLIST": viewmodel.players.watchlistWon, "TRADEPILE": viewmodel.players.tradepile };

        for (let list of Object.keys(lists)) {
            for (let key of Object.keys(lists[list])) {
                let playerBase = lists[list][key];
                for (let player of playerBase.players) {
                    csvContent += dataRenderer([player.definitionId, playerBase.data.l, playerBase.data.f, player.rating, player.preferredPosition, getRarity(player.rareflag), player._skillMoves + 1, player._weakFoot, getPlayStyle(player.playStyle), getNationName(player.nationId), getLeagueName(player.leagueId), getTeamName(player.teamId), player.untradeable || false, player.loans > -1 ? player.loans : 0, player.lastSalePrice, `${player._itemPriceLimits ? player._itemPriceLimits.minimum : ''}-${player._itemPriceLimits ? player._itemPriceLimits.maximum : ''}`, player.discardValue, list]);
                }
            }
        }

        csvContent += endRenderer ? endRenderer() : '';

        // The download function takes a CSV string, the filename and mimeType as parameters
        // Scroll/look down at the bottom of this snippet to see how download is called
        const download = function (content, fileName, mimeType) {
            var a = document.createElement('a');
            mimeType = mimeType || 'application/octet-stream';

            if (navigator.msSaveBlob) { // IE10
                navigator.msSaveBlob(new Blob([content], {
                    type: mimeType
                }), fileName);
            } else if (URL && 'download' in a) { //html5 A[download]
                a.href = URL.createObjectURL(new Blob([content], {
                    type: mimeType
                }));
                a.setAttribute('download', fileName);
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            } else {
                location.href = 'data:application/octet-stream,' + encodeURIComponent(content); // only this mime type is supported
            }
            resolve();
        }

        download(csvContent, filename, mimeType);
    });
}
/// #endif