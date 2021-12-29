let plugin;
/// #if process.env.CLUB_ANALYZER
import localize from "../../localization";
import { addStyle } from "../../utils/styles";
import { ClubAnalyzerController } from "./ClubAnalyzerController";
import styles from "./styles.css";

function run() {

    function generateClubAnalyzerTab() {
        const clubAnalyzerTab = new UTTabBarItemView();
        clubAnalyzerTab.init();
        clubAnalyzerTab.setTag(9);
        clubAnalyzerTab.setText(localize("plugins.clubAnalyzer.settings.title"));
        clubAnalyzerTab.addClass("icon-club");
        return clubAnalyzerTab;
    }

    const UTGameTabBarController_initWithViewControllers = UTGameTabBarController.prototype.initWithViewControllers;
    UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
        const clubAnalyzerNav = new UTGameFlowNavigationController();
        clubAnalyzerNav.initWithRootController(new ClubAnalyzerController());
        clubAnalyzerNav.tabBarItem = generateClubAnalyzerTab();
        tabs.push(clubAnalyzerNav);
        UTGameTabBarController_initWithViewControllers.call(this, tabs);
    };

    addStyle('paletools-club-analyzer', styles.replace("#EXTENDED_PLAYER_INFO.TOTAL#", localize("extendedPlayerInfo.total")));
}

plugin = {
    run: run
};
/// #endif

export default plugin;