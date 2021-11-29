export default {
    "enabled": "Habilitado",

    /// #if process.env.GRID_MODE
    "plugins.gridMode.title": "Modo grilla",
    /// #endif

    "plugins.donation.title": "Potenciado por Paletools",
    "plugins.donation.paypal": "Donaci&oacute;n PayPal",
    "plugins.donation.mercadopago": "Donaci&oacute;n MercadoPago",

    /// #if process.env.COMPARE_MIN_MAX_PRICES
    "plugins.compareMinMaxPrices.settings.title": "Comparar Precios",
    "plugins.compareMinMaxPrices.minPriceLabel": "Min. Comp. Ahora",
    "plugins.compareMinMaxPrices.maxPriceLabel": "Max. Comp. Ahora",
    /// #endif

    /// #if process.env.PLAYER_ACTIONS
    "plugins.playerActions.settings.title": "Acciones del Jugador",
    "plugins.playerActions.settings.copyPlayerId": "Habilitar copiar Id del jugador",
    "plugins.playerActions.settings.futbinSearch": "Habilitar búsqueda en FUTBIN",
    "plugins.playerActions.copyPlayerId": "Copiar Id del jugador al portapapeles",
    "plugins.playerActions.futbinSearch": "Buscar en FUTBIN",
    /// #endif

    /// #if process.env.MARKET_SEARCH_FILTERS
    "plugins.marketSearchFilters.settings.title": "Filtros de Búsqueda del Mercado",
    "plugins.marketSearchFilters.settings.savedFilters": "Habilitar filtros guardados",
    "plugins.marketSearchFilters.settings.playerId": "Habilitar Id del jugador",
    "plugins.marketSearchFilters.settings.playerRating": "Habilitar valoración del jugador",
    "plugins.marketSearchFilters.filterSaved": "Filtro guardado",
    "plugins.marketSearchFilters.filterDeleted": "Filter eliminado",
    "plugins.marketSearchFilters.loadFilters": "-- Elija un filtro a cargar --",
    "plugins.marketSearchFilters.playerId": "Id del jugador",
    "plugins.marketSearchFilters.playerRating": "Valoración del jugador",
    "plugins.marketSearchFilters.filter.name": "Nombre del filtro",
    "plugins.marketSearchFilters.filter.save": "Guardar",
    "plugins.marketSearchFilters.filter.delete": "Eliminar",
    "plugins.marketSearchFilters.playerIdWarning": "Esta funcionalidad es EXPERIMENTAL y podría llevar a que tu cuenta sea suspendida, ¿estas seguro de querer activarla?",
    /// #endif

    /// #if process.env.SNIPE
    "plugins.snipe.settings.title": "Sniping",
    "plugins.snipe.settings.enableDisable": "Habilitar / Deshabilitar",
    "plugins.snipe.settings.results.pressEnter": "Auto presionar ENTER después de comprar",
    "plugins.snipe.settings.search.enableBotMode": "Modo BOT",
    "plugins.snipe.settings.back": "Volver atrás",
    "plugins.snipe.settings.search.search": "Buscar",
    "plugins.snipe.settings.results.buy": "Comprar ahora",
    "plugins.snipe.settings.search.resetBid": "Resetear puja",
    "plugins.snipe.settings.results.bid": "Pujar",
    "plugins.snipe.settings.results.transfer": "Enviar item a a lista de transferencia",
    "plugins.snipe.settings.results.club": "Enviar item al club",
    "plugins.snipe.settings.results.sell": "Venta rápida",
    "plugins.snipe.settings.results.compare": "Comparar precio",
    "plugins.snipe.settings.lists.up": "Seleccionar el item anterior en la lista",
    "plugins.snipe.settings.lists.down": "Seleccionar el item siguiente en la lista",
    "plugins.snipe.settings.lists.prev": "Ir a la página anterior",
    "plugins.snipe.settings.lists.next": "Ir a la página siguiente",
    "plugins.snipe.settings.search.decMinBid": "Disminuir puja mínima",
    "plugins.snipe.settings.search.incMinBid": "Aumentar puja mínima",
    "plugins.snipe.settings.search.decMaxBid": "Disminuir puja máxima",
    "plugins.snipe.settings.search.incMaxBid": "Aumentar puja máxima",
    "plugins.snipe.settings.search.decMinBuy": "Disminuir comprar ahora mínimo",
    "plugins.snipe.settings.search.incMinBuy": "Aumentar comprar ahora mínimo",
    "plugins.snipe.settings.search.decMaxBuy": "Disminuir comprar ahora máximo",
    "plugins.snipe.settings.search.incMaxBuy": "Aumentar comprar ahora máximo",
    "plugins.snipe.settings.search.botModeMinBid": "Modo bot, aumentar puja mínima",
    "plugins.snipe.settings.search.botModeMinBuy": "Modo bot, aumentar comprar ahora mínimo",
    /// #endif

    // #if process.env.DUPLICATED_TO_SBC
    "plugins.duplicatedToSbc.button.text": "Usar jugadores duplicados",
    "plugins.duplicatedToSbc.settings.title": "Duplicados a SBC",
    "plugins.duplicatedToSbc.button.textLoading": "Cargado club... {count} jugadores cargados",
    /// #endif

    /// #if process.env.SELECT_CHEAPEST
    "plugins.selectCheapest.settings.title": "Elegir el jugador mas barato automáticamente",
    /// #endif

    /// #if process.env.FILL_SBC_FROM_FUTBIN
    "plugins.fillSbcFromFutbin.settings.title": "Completar SBC con FUTBIN",
    "plugins.fillSbcFromFutbin.settings.importToolLabel": "Link de instalación",
    "plugins.fillSbcFromFutbin.settings.importToolLinkText": "Exportar SBC de FUTBIN",
    "plugins.fillSbcFromFutbin.settings.installInstructions": "Arrastre el link de instalación a la barra de marcadores",
    "plugins.fillSbcFromFutbin.button.text": "Importar SBC desde FUTBIN",
    "plugins.fillSbcFromFutbin.button.textLoading": "Cargando club... {count} jugadores cargados",
    "plugins.fillSbcFromFutbin.copyError": "Hubo un error importando el SBC desde FUTBIN, asegúrate de usar la herramienta Exportar SBC de FUTBIN antes",
    /// #endif

    /// #if process.env.MARK_DUPLICATED
    "plugins.markDuplicated.settings.title": "Marcar jugadores duplicados",
    "plugins.markDuplicated.loading": "Cargando club: {count} jugadores cargados",
    /// #endif

    /// #if process.env.IMPROVED_PLAYER_SEARCH
    "plugins.improvedPlayerSearch.settings.title": "Búsqueda de jugadores mejorada",
    /// #endif

    /// #if process.env.SBC_SELECT_MULTIPLE_PLAYERS
    "plugins.sbcSelectMultiplePlayers.settings.title": "Elegir multiples jugadores en un SBC",
    // #endif

   /// #if process.env.FILTER_SBCS
   "plugins.filterSbcs.settings.title": "Filtrar SBCs",
   "plugins.filterSbcs.label": "Buscar",
   // #endif

    /// #if process.env.SETTINGS_MENU
    "plugins.settings.title": "Configuración de Paletools"
    /// #endif
};

