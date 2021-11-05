import PalesnipeSettingsView from "./PalesnipeSettingsView";

const PalesnipeSettingsController = function (t) {
    UTViewController.call(this);
};

JSUtils.inherits(PalesnipeSettingsController, UTViewController);

PalesnipeSettingsController.prototype._getViewInstanceFromData = function () {
    return new PalesnipeSettingsView();
}

PalesnipeSettingsController.prototype.viewDidAppear = function () {
    this.getNavigationController().setNavigationVisibility(true, true);
}

PalesnipeSettingsController.prototype.getNavigationTitle = function () {
    return "Palesnipe Settings";
}

export default PalesnipeSettingsController;