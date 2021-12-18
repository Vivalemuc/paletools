import VERSION from "./version";
import { EVENTS, triggerEvent } from "./events";

const buttons = {
    back: 'Digit1',
    enableDisable: 'Comma',
    lists: {
        up: 'ArrowUp',
        down: 'ArrowDown',
        prev: 'ArrowLeft',
        next: 'ArrowRight',
    },
    search: {
        resetBid: 'Backquote',
        decMinBid: 'ArrowLeft',
        incMinBid: 'ArrowRight',
        decMaxBid: 'End',
        incMaxBid: 'Home',
        decMinBuy: 'Delete',
        incMinBuy: 'PageDown',
        decMaxBuy: 'ArrowDown',
        incMaxBuy: 'ArrowUp',
        search: 'Digit2',
        botModeMinBid: 'BracketRight',
        botModeMinBuy: 'BracketLeft',
        enableBotMode: false
    },
    results: {
        bid: 'Digit4',
        buy: 'Digit3',
        transfer: 'KeyR',
        club: 'KeyC',
        pressEnter: true,
        autoBuy: false,
        preventBack: false,
        sell: 'KeyQ',
        decBid: 'Delete',
        incBid: 'PageDown',
        compare: 'KeyM'
    }
};

let settings = {
    enabled: true,
    appVersion: VERSION,
    plugins: {
        gridMode: {
            enabled: false
        },
        compareMinMaxPrices: {
            enabled: true
        },
        marketSearchFilters: {
            playerId: false,
            playerRating: true,
            savedFilters: true
        },
        donation: {
            enabled: true
        },
        playerActions: {
            copyPlayerId: true,
            futbinSearch: true
        },
        snipe: {
            buttons: buttons
        },
        duplicatedToSbc: {
            enabled: true
        },
        selectCheapest: {
            enabled: false
        },
        pristinePlayers: {
            enabled: true
        },
        fillSbcFromFutbin: {
            enabled: true
        },
        improvedPlayerSearch: {
            enabled: true
        },
        markDuplicated: {
            enabled: true
        },
        sbcSelectMultiplePlayers: {
            enabled: true
        },
        filterSbcs: {
            enabled: true
        }
    }
};

if (localStorage.getItem("paletools:settings")) {
    const savedSettings = JSON.parse(atob(localStorage.getItem("paletools:settings")));
    $.extend(true, settings, savedSettings);
    triggerEvent(EVENTS.CONFIGURATION_LOADED, settings);
}

export function saveConfiguration() {
    localStorage.setItem("paletools:settings", btoa(JSON.stringify(settings)));
    triggerEvent(EVENTS.CONFIGURATION_SAVED, settings);
}

export default settings;