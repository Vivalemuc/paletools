import { addLabelWithTextInputWithKeyPress, addLabelWithToggle } from "../../controls";
import { getObjectPropertyValueByPath, setObjectPropertyByPath } from "../../utils/object";
import settings, { saveConfiguration } from "../../settings";

const cfg = settings.plugins.snipe;
export default function menu(){

    function input(container, path){
        const value = getObjectPropertyValueByPath(cfg, path)
        addLabelWithTextInputWithKeyPress(container, `plugins.snipe.settings.${path.replace('buttons.','')}`, value, (elem, code) => {
            elem.value = code;
            setObjectPropertyByPath(cfg, path, code);
            saveConfiguration();
        });
    }

    function toggle(container, path){
        const value = getObjectPropertyValueByPath(cfg, path)
        addLabelWithToggle(container, `plugins.snipe.settings.${path.replace('buttons.','')}`, value, toggleState => {
            setObjectPropertyByPath(cfg, path, toggleState);
            saveConfiguration();
        });
    }


    let container = document.createElement("div");

    let generalContainer = document.createElement("div");
    input(generalContainer, "buttons.enableDisable");
    toggle(generalContainer, "buttons.results.pressEnter");
    toggle(generalContainer, "buttons.search.enableBotMode");

    let searchContainer = document.createElement("div");
    input(searchContainer, "buttons.back");
    input(searchContainer, "buttons.search.search");
    input(searchContainer, "buttons.results.buy");
    input(searchContainer, "buttons.search.resetBid");
    input(searchContainer, "buttons.results.bid");
    input(searchContainer, "buttons.results.transfer");
    input(searchContainer, "buttons.results.club");
    input(searchContainer, "buttons.results.sell");
    input(searchContainer, "buttons.results.compare");
    input(searchContainer, "buttons.lists.up");
    input(searchContainer, "buttons.lists.down");
    input(searchContainer, "buttons.lists.prev");
    input(searchContainer, "buttons.lists.next");
    // add autopress enter setting

    let bidContainer = document.createElement("div");
    input(bidContainer, "buttons.search.decMinBid");
    input(bidContainer, "buttons.search.incMinBid");
    input(bidContainer, "buttons.search.decMaxBid");
    input(bidContainer, "buttons.search.incMaxBid");
    input(bidContainer, "buttons.search.decMinBuy");
    input(bidContainer, "buttons.search.incMinBuy");
    input(bidContainer, "buttons.search.decMaxBuy");
    input(bidContainer, "buttons.search.incMaxBuy");
    input(bidContainer, "buttons.search.botModeMinBid");
    input(bidContainer, "buttons.search.botModeMinBuy");

    container.appendChild(generalContainer);
    container.appendChild(searchContainer);
    container.appendChild(bidContainer);
    
    return container;
}