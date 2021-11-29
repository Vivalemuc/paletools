let plugin;

import { addLabelWithToggle } from "../../controls";
// #if process.env.FILTER_SBCS
import { EVENTS, on } from "../../events";
import localize from "../../localization";
import settings, { saveConfiguration } from "../../settings";

const cfg = settings.plugins.filterSbcs;

function run(){
    const UTSBCHubView_generate = UTSBCHubView.prototype._generate;
    UTSBCHubView.prototype._generate = function _generate(){
        UTSBCHubView_generate.call(this);
        if(cfg.enabled && !this._filterSbcsGenerated){

            const input = new UTTextInputControl();
            input.setPlaceholder(localize("plugins.filterSbcs.label"));
            $(input.getRootElement())
                .css("float", "left")
                .css("marginLeft", "16px")
                .css("width", "auto")
                .keyup(ev => {
                $(".ut-sbc-set-tile-view").each(function(){
                    $(this).show();
                    if(ev.target.value.length > 0 && $(".tileHeader", this).text().toLowerCase().indexOf(ev.target.value.toLowerCase()) === -1) {
                        $(this).hide();
                    }
                });
            });

            $(".menu-container", this._SBCCategoriesTM.getRootElement()).prepend(input.getRootElement());
            
            on(EVENTS.APP_DISABLED, () => $(input.getRootElement()).hide());
            on(EVENTS.APP_ENABLED, () => $(input.getRootElement()).show());
            
            this._filterSbcsGenerated = true;
        }
    }
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });
    return container;
}

plugin = {
    run: run,
    order: 6,
    settings: {
        name: "filterSbcs",
        title: 'plugins.filterSbcs.settings.title',
        menu: menu
    }
};
// #endif

export default plugin;