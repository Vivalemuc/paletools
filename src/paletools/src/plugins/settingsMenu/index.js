let plugin;

/// #if process.env.SETTINGS_MENU
import PalesnipeSettingsController from "./PalesnipeSettingsController";
import styles from "./styles.css";
import { addStyle } from "../../utils/styles";
import localize from "../../localization";

plugin = {
    run: (menus) => {
        const UTGameTabBarController_initWithViewControllers = UTGameTabBarController.prototype.initWithViewControllers;
        UTGameTabBarController.prototype.initWithViewControllers = function (tabs) {
            const palesnipeNav = new UTGameFlowNavigationController();
            palesnipeNav.initWithRootController(new PalesnipeSettingsController(menus));
            palesnipeNav.tabBarItem = generatePalesnipeSettingsTab();
            tabs.push(palesnipeNav);
            UTGameTabBarController_initWithViewControllers.call(this, tabs);
        }

        function generatePalesnipeSettingsTab() {
            const tab = new UTTabBarItemView();
            tab.init();
            tab.setTag(6);
            tab.__buttonText.innerHTML = localize("plugins.settings.title");
            tab.addClass("icon-transfer");
            tab.getRootElement().classList.add("palesnipe-element");
            return tab;
        }

        addStyle('paletools-settings', styles);
    }
}
/// #endif

export default plugin;