/// #if process.env.CLUB_ANALYZER

import localize from "../../localization";

export function ClubAnalyzerView(t) {
    UTView.call(this);
    this.onReloadClicked = new EAObservable();
    this.onExportCsvClicked = new EAObservable();
    this.onExportHtmlClicked = new EAObservable();
}

JSUtils.inherits(ClubAnalyzerView, UTView);

ClubAnalyzerView.prototype.dealloc = function dealloc() {
    this.onReloadClicked.dealloc();
    this.onReloadClicked = null;
    this.onExportCsvClicked.dealloc();
    this.onExportCsvClicked = null;
    this.onExportHtmlClicked.dealloc();
    this.onExportHtmlClicked = null;
}

ClubAnalyzerView.prototype._appendMainMenu = function (container) {
    $(container).append(`
    <div class="ea-filter-bar-view">
        <div class="menu-container">
            <button id="clubanalyzer-players-dashboard" class="ea-filter-bar-item-view selected">Dashboard</button>
            <button id="clubanalyzer-players-by-rating" class="ea-filter-bar-item-view">Rating</button>
            <button id="clubanalyzer-players-by-rarity" class="ea-filter-bar-item-view">${localize("extendedPlayerInfo.general.rarity")}</button>
            <button id="clubanalyzer-players-by-league" class="ea-filter-bar-item-view">${localize("search.details.itemLeague")}</button>
            <button id="clubanalyzer-players-by-nation" class="ea-filter-bar-item-view">${localize("extendedPlayerInfo.general.nation")}</button>
            <button id="clubanalyzer-players-by-unnasigned" class="ea-filter-bar-item-view">${localize("navbar.label.newitems")} <span id="clubanalyzer-counter-unnasigned"></span></button>
            <button id="clubanalyzer-players-by-transferlist" class="ea-filter-bar-item-view">${localize("panel.label.transferlist")} <span id="clubanalyzer-counter-tradepile"></span></button>
            <button id="clubanalyzer-players-by-transfertargets" class="ea-filter-bar-item-view">${localize("panel.label.transfertargets")}  <span id="clubanalyzer-counter-watchlist"></span></button>
        </div>
    </div>`);

    const allButtons = $(".menu-container > button", container);
    allButtons.on("mouseover", ev => {
        allButtons.removeClass("hover");
        $(ev.currentTarget).addClass("hover");
    }).click(ev => {
        $(".club-analyzer-report").hide();
        allButtons.removeClass("selected");
        $(ev.currentTarget).addClass("selected");
        $(`#${ev.currentTarget.id.replace("players-", "report-")}`).show();
        $(`.${ev.currentTarget.id.replace("players-", "report-")}`).show();
    });
}

ClubAnalyzerView.prototype._appendBody = function (container) {
    const contentContainer = $('<div class="ut-pinned-list-container ut-content-container"></div>');
    const content = $('<div class="ut-content"></div>');

    const pinnedList = $('<div class="ut-pinned-list club-analyzer"></div>');
    content.append(pinnedList);
    contentContainer.append(content);
    $(container)
            .append(contentContainer)
            .append(`<div class="button-container">
                <button id="reload-club-analyzer" class="btn-standard call-to-action" data-loading="Reloading...">${localize("plugins.clubAnalyzer.view.buttons.reload")}</button>
                <button id="export-csv-club-analyzer" class="btn-standard call-to-action" data-loading="Exporting...">${localize("plugins.clubAnalyzer.view.buttons.exportCsv")}</button>
                <button id="export-html-club-analyzer" class="btn-standard call-to-action" data-loading="Exporting...">${localize("plugins.clubAnalyzer.view.buttons.exportHtml")}</button>
            </div>`);

    $("#reload-club-analyzer", container).click(() => {
        this.onReloadClicked.notify();
    });

    $("#export-csv-club-analyzer", container).click(() => {
        this.onExportCsvClicked.notify();
    });

    $("#export-html-club-analyzer", container).click(() => {
        this.onExportHtmlClicked.notify();
    });


    return pinnedList;
}

ClubAnalyzerView.prototype._createDashboard = function (viewmodel) {
    const counters = viewmodel.counters;
    return `<div id="clubanalyzer-report-dashboard" class="club-analyzer-report">
                    <h3 class="tile">
                    ${localize("plugins.clubAnalyzer.view.dashboard.description")}
                    </h3>
                    <div>
                    <table class="rarities tile">
                        <tr><th></th><th>${localize("item.raretype1")}</th><th>${localize("item.raretype0")}</th></tr>
                        <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/images/SearchFilters/level/gold.png" /></td><td>${counters.rare.gold}</td><td>${counters.common.gold}</td></tr>
                        <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/images/SearchFilters/level/silver.png" /></td><td>${counters.rare.silver}</td><td>${counters.common.silver}</td></tr>
                        <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/images/SearchFilters/level/bronze.png" /></td><td>${counters.rare.bronze}</td><td>${counters.common.bronze}</td></tr>
                        <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/backgrounds/itemCompanionBGs/e942629f-4e9f-4db7-b583-4313d8dd808a/cards_bg_s_1_48_0.png" /></td><td>${counters.rare.ucl}</td><td>${counters.common.ucl}</td></tr>
                        <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/images/SearchFilters/level/SP.png" /></td><td>${counters.special}</td><td></td></tr>
                    </table>
                    </div>
                    <div>
                        <table class="latam tile">
                            <tr><th></th><th>${localize("search.cardLevels.cardLevel3")}</th><th>${localize("search.cardLevels.cardLevel2")}</th><th>${localize("search.cardLevels.cardLevel1")}</th></tr>
                            <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/backgrounds/itemCompanionBGs/8f60cc02-051a-4f95-bdcb-a2bc454e1f47/cards_bg_s_1_53_0.png" /></td><td>${counters.libertadores.gold}</td><td>${counters.libertadores.silver}</td><td>${counters.libertadores.bronze}</td></tr>
                            <tr><td><img src="https://www.ea.com/fifa/ultimate-team/web-app/content/21D4F1AC-91A3-458D-A64E-895AA6D871D1/2021/fut/items/images/backgrounds/itemCompanionBGs/ab719e69-0d3e-430c-8e67-80a106de93c1/cards_bg_s_1_52_0.png" /></td><td>${counters.sudamericana.gold}</td><td>${counters.sudamericana.silver}</td><td>${counters.sudamericana.bronze}</td></tr>
                        </table>
                        <table class="limbo tile">
                            <tr><th>${localize("navbar.label.newitems")}</th><th>${localize("panel.label.transferlist")}</th><th>${localize("panel.label.transfertargets")}</th></tr>
                            <tr><td>${counters.unnasignedTotal}</td><td>${counters.tradepileTotal}</td><td>${counters.watchlistTotal}</td></tr>
                        </table>
                    </div>
                </div>`;
}

ClubAnalyzerView.prototype._renderPlayer = function (player, addAuctionInfo) {
    return `<li class="player ${addAuctionInfo ? "inline-list" : ""}">
                <a class="fullname" href="https://www.futbin.com/players?page=1&search=${player.data.f}%20${player.data.l}" target="_blank">
                    <span class="firstname">${player.data.f}</span> 
                    <span class="lastname">${player.data.l}</span>
                </a>
                <span class="rating">${player.rating}</span>
                ${player.untradeable ? '<span class="fut_icon icon_untradeable untradeable"></span>' : ''}
                ${player.loans > -1 ? `<span class="loans">${player.loans}</span>` : ''}
                ${addAuctionInfo ? `<span class="count">${player.count}</span>` : ""}
                ${addAuctionInfo ? `<span class="avg">${Math.round(player.sumPrices / player.count)}</span>` : ""}
                ${addAuctionInfo ? `<span class="rarity">${localize(player.rarity)}</span>` : ""}
            </li>`;
}

ClubAnalyzerView.prototype._createCountReport = function (id, data) {
    let html = `<div id="${id}" class="club-analyzer-report">`;
    html += this._createCountReportTree(data, 0);
    html += "</div>";
    return html;
}

ClubAnalyzerView.prototype._createCountReportTree = function (data, level) {
    let html = "";
    if (data instanceof Array) {
        html += '<ul class="players hide">';
        for (let player of data) {
            html += this._renderPlayer(player);
        }
        html += '</ul>';
    }
    else {
        html += level === 0 ? "<ul>" : '<ul class="hide">';
        for (let value of Object.keys(data).sort()) {
            html += level === 0 ? '<li class="inline-list">' : "<li>";
            html += `<span class="value">${value}</span>`;
            html += `<span class="count">${data[value].players ? data[value].players.length : data[value].length}</span>`;
            html += this._createCountReportTree(data[value].by ? data[value].by : data[value], level + 1);
            html += "</li>";
        }
        html += "</ul>";
    }

    return html;
}

ClubAnalyzerView.prototype._createAuctionReport = function (id, data, caption, className) {
    const keys = Object.keys(data);

    if (keys.length === 0) {
        return;
    }

    className = className || "";
    let html = `<div id="${id}" class="club-analyzer-report club-analyzer-auctionreport ${className}">`;
    html += caption ? `<h2>${caption}</h2>` : "";
    html += `<ul>`;
    for (let player of keys.map(x => data[x]).sort((p1, p2) => {
        const n1 = p1.data.f + p1.data.l;
        const n2 = p2.data.f + p2.data.l;
        return n1 < n2 ? -1 : n1 > n2 ? 1 : 0;
    })) {
        html += this._renderPlayer(player, true);
    }

    html += "</ul></div>";
    return html;
}

ClubAnalyzerView.prototype._generate = function _generate() {
    if (!this.generated) {
        const container = document.createElement("div");
        this._appendMainMenu(container);
        this._loadingMessage = $(`<div id="clubanalyzer-loading-message"></div>`).hide();
        $(container).append(this._loadingMessage);
        this._body = this._appendBody(container);
        this.__root = container;
        this.generated = true;
    }
}

ClubAnalyzerView.prototype.showLoading = function(msg){
    this._loadingMessage.text(msg).show();
}

ClubAnalyzerView.prototype.hideLoading = function(){
    this._loadingMessage.text("").hide();
}

ClubAnalyzerView.prototype.prepareForUpdate = function(){
    this._body.empty();
    $(".menu-container > button", this.__root).removeClass("selected").first().addClass("selected");
}

ClubAnalyzerView.prototype.update = function (viewmodel) {
    $("#clubanalyzer-counter-unnasigned").text(viewmodel.counters.unnasignedTotal);
    $("#clubanalyzer-counter-tradepile").text(viewmodel.counters.tradepileTotal);
    $("#clubanalyzer-counter-watchlist").text(viewmodel.counters.watchlistTotal);

    this._body.empty();
    this._body.append(this._createDashboard(viewmodel));
    this._body.append(this._createCountReport("clubanalyzer-report-by-rating", viewmodel.players.byRating));
    this._body.append(this._createCountReport("clubanalyzer-report-by-rarity", viewmodel.players.byRarity));
    this._body.append(this._createCountReport("clubanalyzer-report-by-league", viewmodel.players.byLeague));
    this._body.append(this._createCountReport("clubanalyzer-report-by-nation", viewmodel.players.byNation));
    this._body.append(this._createAuctionReport("clubanalyzer-report-by-unnasigned", viewmodel.players.unnasigned.tradeable, "Tradeable", "clubanalyzer-report-by-unnasigned"));
    this._body.append(this._createAuctionReport("clubanalyzer-report-by-unnasigned2", viewmodel.players.unnasigned.untradeable, "Untradeable", "clubanalyzer-report-by-unnasigned"));
    this._body.append(this._createAuctionReport("clubanalyzer-report-by-transferlist", viewmodel.players.tradepile));
    this._body.append(this._createAuctionReport("clubanalyzer-report-by-transfertargets", viewmodel.players.watchlistWon, localize("watchlist.dock.categories.won")));
    this._body.append(this._createAuctionReport("clubanalyzer-report-by-transfertargets2", viewmodel.players.watchlistWinning, localize("wdock.label.winning"), "clubanalyzer-report-by-transfertargets"));
    this._body.append(this._createAuctionReport("clubanalyzer-report-by-transfertargets3", viewmodel.players.watchlistLoosing, localize("dock.label.outbid"), "clubanalyzer-report-by-transfertargets"));
    this._body.append(this._createAuctionReport("clubanalyzer-report-by-transfertargets4", viewmodel.players.watchlistLost, localize("watchlist.dock.categories.expired"), "clubanalyzer-report-by-transfertargets"));

    $(".club-analyzer-report").hide().first().show();

    $("li", this._body).click(ev => {
        const elem = $(ev.currentTarget);
        const children = $(ev.currentTarget).children("ul");
        children.toggle();
        if (children.is(":visible")) {
            elem.addClass("expanded");
        }
        else {
            elem.removeClass("expanded");
        }

        ev.stopPropagation();
    });
}
/// #endif