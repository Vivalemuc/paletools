export default {
    "enabled": "Enabled",

    /// #if process.env.GRID_MODE
    "plugins.gridMode.title": "Grid Mode",
    /// #endif

    "plugins.donation.title": "Powered by Paletools",
    "plugins.donation.paypal": "PayPal Donation",
    "plugins.donation.mercadopago": "MercadoPago Donation",

    /// #if process.env.COMPARE_MIN_MAX_PRICES
    "plugins.compareMinMaxPrices.settings.title": "Compare Prices",
    "plugins.compareMinMaxPrices.minPriceLabel": "Min Buy Now",
    "plugins.compareMinMaxPrices.maxPriceLabel": "Max Buy Now",
    /// #endif

    /// #if process.env.PLAYER_ACTIONS
    "plugins.playerActions.settings.title": "Player Actions",
    "plugins.playerActions.settings.copyPlayerId": "Enable Copy Player Id",
    "plugins.playerActions.settings.futbinSearch": "Enable FUTBIN search",
    "plugins.playerActions.copyPlayerId": "Copy Player Id to clipbpard",
    "plugins.playerActions.futbinSearch": "FUTBIN search",
    /// #endif

    /// #if process.env.MARKET_SEARCH_FILTERS
    "plugins.marketSearchFilters.settings.title": "Market Search Filters",
    "plugins.marketSearchFilters.settings.savedFilters": "Enable Saved Filters",
    "plugins.marketSearchFilters.settings.playerId": "Enable Player Id",
    "plugins.marketSearchFilters.settings.playerRating": "Enable Player Rating",
    "plugins.marketSearchFilters.filterSaved": "Filter saved",
    "plugins.marketSearchFilters.filterDeleted": "Filter deleted",
    "plugins.marketSearchFilters.loadFilters": "-- Select a filter to load --",
    "plugins.marketSearchFilters.playerId": "Player ID",
    "plugins.marketSearchFilters.playerRating": "Player Rating",
    "plugins.marketSearchFilters.filter.name": "Filter name",
    "plugins.marketSearchFilters.filter.save": "Save",
    "plugins.marketSearchFilters.filter.delete": "Delete",
    "plugins.marketSearchFilters.playerIdWarning": "This is an experimental feature and could potentially lead to you account being banned, are you sure you want to enable it?",
    /// #endif

    /// #if process.env.SNIPE
    "plugins.snipe.settings.title": "Sniping",
    "plugins.snipe.settings.enableDisable": "Enable / Disable",
    "plugins.snipe.settings.results.pressEnter": "Auto press ENTER after buy",
    "plugins.snipe.settings.search.enableBotMode": "BOT Mode",
    "plugins.snipe.settings.back": "Go Back",
    "plugins.snipe.settings.search.search": "Search",
    "plugins.snipe.settings.results.buy": "Buy now",
    "plugins.snipe.settings.search.resetBid": "Reset Bid",
    "plugins.snipe.settings.results.bid": "Bid",
    "plugins.snipe.settings.results.transfer": "Send item to transfer list",
    "plugins.snipe.settings.results.club": "Send item to club",
    "plugins.snipe.settings.results.sell": "Quick sell item",
    "plugins.snipe.settings.results.compare": "Compare price",
    "plugins.snipe.settings.lists.up": "Select previous player in lists",
    "plugins.snipe.settings.lists.down": "Select next player in lists",
    "plugins.snipe.settings.lists.prev": "Go to previous page",
    "plugins.snipe.settings.lists.next": "Go to next page",
    "plugins.snipe.settings.search.decMinBid": "Decrease min bid value",
    "plugins.snipe.settings.search.incMinBid": "Increase min bid value",
    "plugins.snipe.settings.search.decMaxBid": "Decrease max bid value",
    "plugins.snipe.settings.search.incMaxBid": "Increase max bid value",
    "plugins.snipe.settings.search.decMinBuy": "Decrease min buy now value",
    "plugins.snipe.settings.search.incMinBuy": "Increase min buy now value",
    "plugins.snipe.settings.search.decMaxBuy": "Decrease max buy now value",
    "plugins.snipe.settings.search.incMaxBuy": "Increase max buy now value",
    "plugins.snipe.settings.search.botModeMinBid": "Bot mode, increment min bid",
    "plugins.snipe.settings.search.botModeMinBuy": "Bot mode, increment min buy now",
    /// #endif

    // #if process.env.DUPLICATED_TO_SBC
    "plugins.duplicatedToSbc.button.text": "Use duplicated players",
    "plugins.duplicatedToSbc.settings.title": "Duplicated to SBC",
    "plugins.duplicatedToSbc.button.textLoading": "Loading players from club... {count} loaded",
    /// #endif

    /// #if process.env.SELECT_CHEAPEST
    "plugins.selectCheapest.settings.title": "Select cheapest player automatically",
    /// #endif

    /// #if process.env.FILL_SBC_FROM_FUTBIN
    "plugins.fillSbcFromFutbin.settings.title": "Fill SBC with FUTBIN",
    "plugins.fillSbcFromFutbin.settings.importToolLabel": "Install FUTBIN Link",
    "plugins.fillSbcFromFutbin.settings.importToolLinkText": "Export FUTBIN SBC",
    "plugins.fillSbcFromFutbin.settings.installInstructions": "Drag the install link to the bookmarks bar",
    "plugins.fillSbcFromFutbin.button.text": "Import SBC from FUTBIN",
    "plugins.fillSbcFromFutbin.button.textLoading": "Loading players from club... {count} loaded",
    "plugins.fillSbcFromFutbin.copyError": "There was an error importing SBC from FUTBIN, make sure you use the Export FUTBIN SBC first",
    /// #endif

    /// #if process.env.MARK_DUPLICATED
    "plugins.markDuplicated.settings.title": "Highlight duplicated players",
    "plugins.markDuplicated.loading": "Loading club players: {count} loaded",
    /// #endif

    /// #if process.env.IMPROVED_PLAYER_SEARCH
    "plugins.improvedPlayerSearch.settings.title": "Improved player search",
    /// #endif

    /// #if process.env.SBC_SELECT_MULTIPLE_PLAYERS
    "plugins.sbcSelectMultiplePlayers.settings.title": "Select Multiple Players on SBCs",
    // #endif

    /// #if process.env.FILTER_SBCS
    "plugins.filterSbcs.settings.title": "Filter SBCs",
    "plugins.filterSbcs.label": "Search",
    // #endif

    /// #if process.env.SETTINGS_MENU
    "plugins.settings.title": "Paletools Settings",
    /// #endif

    /// #if process.env.CLUB_ANALYZER
    "plugins.clubAnalyzer.settings.title": "Club Analyzer",
    "plugins.clubAnalyzer.view.dashboard.description": "Players count (including duplicated, not including loans) in club + unnasigned up to 50, watchlist (won) up to 100 and tradepile",
    "plugins.clubAnalyzer.view.loading.players": "Loading players #COUNT# loaded...",
    "plugins.clubAnalyzer.view.loading.usermassinfo": "Loading unassigned players data...",
    "plugins.clubAnalyzer.view.loading.watchlist": "Loading watchlist data...",
    "plugins.clubAnalyzer.view.loading.tradepile": "Loading tradepile data...",
    "plugins.clubAnalyzer.view.loading.process": "Processing information",
    "plugins.clubAnalyzer.view.buttons.reload": "Reload",
    "plugins.clubAnalyzer.view.buttons.exportCsv": "Export as CSV",
    "plugins.clubAnalyzer.view.buttons.exportHtml": "Export as HTML",
    /// #endif

    /// #if process.env.SHOW_CONSOLE_OUTPUT
    "plugins.showConsoleOutput.settings.title": "Show Console Output",
    /// #endif

    /// #if process.env.SBC_TIMES_COMPLETED
    "plugins.sbcTimesCompleted.settings.title": "SBC times completed notification"
    /// #endif
};

