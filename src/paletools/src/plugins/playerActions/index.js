import copyPlayerIdAction from "./copyPlayerIdAction";
import futbinSearchAction from "./futbinSearchAction";

export default function runPlayerActions() {
    let actions = [copyPlayerIdAction, futbinSearchAction];

    function addActionsToActionPanel(className, buttonsContainerFunc) {
        const generate = className.prototype._generate;
        className.prototype._generate = function _generate() {
            generate.call(this);
            if (!this._generateAddActionsToPanelCalled) {
                for (let action of actions) {
                    action.generate(this, buttonsContainerFunc);
                }

                this._generateAddActionsToPanelCalled = true;
            }
        }

        const _destroyGeneratedElements = className.prototype.destroyGeneratedElements;
        className.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
            _destroyGeneratedElements.call(this);
            for (let action of actions) {
                action.destroyGeneratedElements(this);
            }
        }

        const dealloc = className.prototype.dealloc;
        className.prototype.dealloc = function () {
            dealloc.call(this);
            for (let action of actions) {
                action.dealloc(this);
            }
        }
    }

    addActionsToActionPanel(UTDefaultActionPanelView, instance => instance.__itemActions);
    addActionsToActionPanel(UTAuctionActionPanelView, instance => $(".ut-button-group", instance.getRootElement())[0]);

    const ItemDetails__getPanelViewInstanceFromData = controllers.items.ItemDetails.prototype._getPanelViewInstanceFromData;
    controllers.items.ItemDetails.prototype._getPanelViewInstanceFromData = function _getPanelViewInstanceFromData(e, t) {
        ItemDetails__getPanelViewInstanceFromData.call(this, e, t);
        if (this._panel instanceof UTDefaultActionPanelView || this._panel instanceof UTAuctionActionPanelView) {
            for (let action of actions) {
                action.attachEvent(this);
            }
        }
    }

    for (let action of actions) {
        action.createEvent(controllers.items.ItemDetails.prototype);
    }
}