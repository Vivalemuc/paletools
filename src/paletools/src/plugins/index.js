import minMaxPrices from "./compareMinMaxPrices";
import playerActions from "./playerActions";
import transferTargetsLimbo from "./transferTargetsLimbo";
import unassignedLimbo from "./unassignedLimbo";
import donation from "./donation";
import marketSearchFilters from "./marketSearchFilters";
import gridMode from "./gridMode";
import snipe from "./snipe";
import duplicatedToSbc from "./duplicatedToSbc";
import selectCheapest from "./selectCheapest";
import settingsMenu from "./settingsMenu";
import fillSbcFromFutbin from "./fillSbcFromFutbin";
import improvedPlayerSearch from "./improvedPlayerSearch";
import markDuplicated from "./markDuplicated";
import filterSbcs from "./filterSbcs";
import sbcTimesCompleted from "./sbcTimesCompleted";
import clubAnalyzer from "./clubAnalyzer";
import showConsoleOutput from "./showConsoleOutput";

const plugins = [
    minMaxPrices,
    playerActions,
    transferTargetsLimbo,
    unassignedLimbo,
    donation,
    marketSearchFilters,
    gridMode,
    duplicatedToSbc,
    selectCheapest,
    snipe,
    fillSbcFromFutbin,
    improvedPlayerSearch,
    markDuplicated,
    filterSbcs,
    sbcTimesCompleted,
    clubAnalyzer,
    showConsoleOutput
].filter(x => x);

const menus = [];

export default function runPlugins() {
    plugins.sort((a, b) => {
        return a.order - b.order;
    });
    for (let plugin of plugins) {
        plugin.run();
        if (plugin.settings) {
            menus.push(plugin.settings);
        }
    }

    if(settingsMenu){
        settingsMenu.run(menus);
    }
}