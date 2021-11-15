import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import { getAllClubPlayers, getClubPlayers, getUnnasignedPlayers } from "../../services/club";
import getCurrentController from "../../utils/controller";
import settings from "../../settings";
import { on } from "../../events";

const cfg = settings.plugins.duplicatedToSbc;

function run() {
    const UTSBCSquadDetailPanelView_generate = UTSBCSquadDetailPanelView.prototype._generate;
    UTSBCSquadDetailPanelView.prototype._generate = function _generate() {
        UTSBCSquadDetailPanelView_generate.call(this);
        if(!settings.enabled || !cfg.enabled) return;
        if (!this._unnasignedToSbcCalled) {
            

            this._useUnnasignedPlayersButton = new UTStandardButtonControl();
            this._useUnnasignedPlayersButton.getRootElement().classList.add("call-to-action");
            this._useUnnasignedPlayersButton.init();
            this._useUnnasignedPlayersButton.setText(localize('plugins.duplicatedToSbc.button.text'));
            this._useUnnasignedPlayersButton.addTarget(this, () => {
                fillSbcWithUnnasignedPlayers(count => {
                    this._useUnnasignedPlayersButton.setInteractionState(false);
                    this._useUnnasignedPlayersButton.setText(localize('plugins.duplicatedToSbc.button.textLoading').replace("{count}", count));
                }).then(() => {
                    this._useUnnasignedPlayersButton.setInteractionState(true);
                    this._useUnnasignedPlayersButton.setText(localize('plugins.duplicatedToSbc.button.text'));
                });
            } , EventType.TAP);
            this.__content.appendChild(this._useUnnasignedPlayersButton.getRootElement());


            on("appEnabled", () => $(this)._useUnnasignedPlayersButton.getRootElement().show());
            on("appDisabled", () => $(this)._useUnnasignedPlayersButton.getRootElement().hide());

            this._unnasignedToSbcCalled = true;
        }
    }

    const UTSBCSquadDetailPanelView_destroyGeneratedElements = UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements;
    UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTSBCSquadDetailPanelView_destroyGeneratedElements.call(this);

        if (this._useUnnasignedPlayersButton) {
            this._useUnnasignedPlayersButton.destroy();
        }
    }

    function fillSbcWithUnnasignedPlayers(onClubBatchLoadedCallback) {
        return new Promise(resolve => {
            getUnnasignedPlayers().then(unnasigned => {
                const distinctItemIds = {};
                for (const duplicated of unnasigned.duplicateItemIdList) {
                    if (!distinctItemIds[duplicated.duplicateItemId]) {
                        distinctItemIds[duplicated.duplicateItemId] = duplicated.itemId;
                    }
                }
    
                const playerIds = Object.keys(distinctItemIds).map(x => parseInt(x)).slice(0, 23);
    
                getAllClubPlayers(false, null, onClubBatchLoadedCallback).then(club => {
                    const { _squad, _challenge } = getCurrentController()._leftController;
                    const positionIndexes = _squad.getSBCSlots().reduce((acc, curr) => {
                        if (!curr.position) return acc;
        
                        if (!acc[curr.position.typeName]) {
                            acc[curr.position.typeName] = [];
                        }
                        acc[curr.position.typeName].push(curr.index);
                        return acc;
                    }, {});
    
                    club = club.filter(x => playerIds.indexOf(x.id) > -1);
        
                    let substituteIndex = 11;
                    const players = new Array(23);
                    for (const player of club) {
                        const preferredPosition = positionIndexes[PlayerPosition[player.preferredPosition]];
                        if (preferredPosition && preferredPosition.length > 0) {
                            players[preferredPosition.shift()] = player;
                            if (preferredPosition.length === 0) {
                                delete positionIndexes[player.preferredPosition];
                            }
                        }
                        else {
                            if (substituteIndex < 23) {
                                players[substituteIndex] = player;
                                substituteIndex++;
                            }
                        }
                    }
        
                    _squad.setPlayers(players, true);
                    services.SBC.saveChallenge(_challenge);

                    resolve();
                });
            });
        });
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

export default {
    run: run,
    order: 3,
    settings: {
        name: 'duplicated-to-sbc',
        title: 'plugins.duplicatedToSbc.settings.title',
        menu: menu
    }
};