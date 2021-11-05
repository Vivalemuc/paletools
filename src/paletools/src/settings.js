import VERSION from "./version";
import { triggerEvent } from "./events";

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
        incBid: 'PageDown'
    }
};

let settings = {
    enabled: true,
    appVersion: VERSION,
    palegrid: {
        enabled: false
    },
    palesnipe: {
        buttons: buttons,
        plugins: {
            savedFilters: true,
            playerIdFilter: true,
            playerRatingFilter: true,
            minMaxPrices: true,
            playerIdValue: true,
            futbinSearch: true
        }
    }
};

if (localStorage.getItem("paletools:settings")) {
    const savedSettings = JSON.parse(atob(localStorage.getItem("paletools:settings")));
    Object.assign(settings, savedSettings)
    triggerEvent("configurationLoaded", settings);
}

export function saveConfiguration() {
    localStorage.setItem("paletools:settings", btoa(JSON.stringify(settings)));
    triggerEvent("configurationSaved", settings);
}

export default settings;