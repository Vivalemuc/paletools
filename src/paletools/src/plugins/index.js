import runCompareMinMaxPrices from "./compareMinMaxPrices";
import runPlayerActions from "./playerActions";
import runTransferTagetsLimbo from "./transferTargetsLimbo";
import runUnassignedLimbo from "./unassignedLimbo";
import runSettingsMenu from "./settingsMenu";
import runDonation from "./donation";
import runMarketSearchFilters from "./marketSearchFilters";
import runGridMode from "./gridMode";
import runSnipe from "./snipe";

export default function runPlugins() {
    runCompareMinMaxPrices();
    runPlayerActions();
    runTransferTagetsLimbo();
    runUnassignedLimbo();
    runSettingsMenu();
    runDonation();
    runMarketSearchFilters();
    runGridMode();
    runSnipe();
}

