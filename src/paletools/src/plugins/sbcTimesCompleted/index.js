let plugin;

// #if process.env.SBC_TIMES_COMPLETED
import settings, { saveConfiguration } from "../../settings";
import { addLabelWithToggle } from "../../controls";

const cfg = settings.plugins.sbcTimesCompleted;

function run() {
    const UTSBCSetTileView_render = UTSBCSetTileView.prototype.render;
    UTSBCSetTileView.prototype.render = function render() {
        UTSBCSetTileView_render.call(this);
        if(cfg.enabled){
            $(`<span>&nbsp;(Completed ${this.data.timesCompleted} times)</span>`).insertAfter($(this.__rewardsHeader));
        }
    }
}

function menu(){
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
        name: 'sbc-times-completed',
        title: 'plugins.sbcTimesCompleted.settings.title',
        menu: menu
    }
}
// #endif

export default plugin;