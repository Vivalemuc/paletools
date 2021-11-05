import settings from "../../settings";

const futBinSearchAction = {
    generate: (instance, buttonsContainerFunc) => {
        if (settings.palesnipe.plugins.futbinSearch) {
            instance._futbinSearchButton = new UTGroupButtonControl();
            instance._futbinSearchButton.init();
            instance._futbinSearchButton.setText("View in FUTBIN");
            instance._futbinSearchButton.addTarget(instance, () => instance.onFutbinSearch.notify(), EventType.TAP);
            instance._futbinSearchButton.getRootElement().classList.add("palesnipe-element");
            instance.onFutbinSearch = new EAObservable();
            buttonsContainerFunc(instance).appendChild(instance._futbinSearchButton.getRootElement());
        }
    },
    destroyGeneratedElements: (instance) => {
        if (instance._futbinSearchButton) {
            instance._futbinSearchButton.destroy();
        }
    },
    dealloc: (instance) => {
        if (instance.onFutbinSearch) {
            instance.onFutbinSearch.dealloc();
        }
    },
    attachEvent: (instance) => {
        if (instance._panel.onFutbinSearch) {
            instance._panel.onFutbinSearch.observe(instance, instance._onFutbinSearch);
        }
    },
    
    createEvent: (proto) => {
        proto._onFutbinSearch = function () {
            window.open(`https://www.futbin.com/players?page=1&search=${this._viewmodel.current()._staticData.firstName}%20${this._viewmodel.current()._staticData.lastName}`);
        }
    }
}

export default futBinSearchAction;