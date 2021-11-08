import localize from "../../localization";
import PalesnipeSettingsView from "./PalesnipeSettingsView";

const PalesnipeSettingsController = function (menus) {
    this._menus = menus;
    UTViewController.call(this);
};

JSUtils.inherits(PalesnipeSettingsController, UTViewController);

PalesnipeSettingsController.prototype._getViewInstanceFromData = function () {
    return new PalesnipeSettingsView(this._menus);
}

PalesnipeSettingsController.prototype.viewDidAppear = function () {
    this.getNavigationController().setNavigationVisibility(true, true);
}

PalesnipeSettingsController.prototype.getNavigationTitle = function () {
    return localize("plugins.settings.title");
}

export default PalesnipeSettingsController;