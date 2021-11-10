import { addLabelWithLink, addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import { getAllClubPlayers, getClubPlayers, getUnnasignedPlayers } from "../../services/club";
import getCurrentController from "../../utils/controller";
import settings from "../../settings";
import { on } from "../../events";
import styles from "./styles.css";
import { addStyle } from "../../utils/styles";
import { getConceptPlayers } from "../../services/players";

const cfg = settings.plugins.fillSbcFromFutbin;

function run() {
    const UTSBCSquadDetailPanelView_generate = UTSBCSquadDetailPanelView.prototype._generate;
    UTSBCSquadDetailPanelView.prototype._generate = function _generate() {
        UTSBCSquadDetailPanelView_generate.call(this);
        if (!settings.enabled || !cfg.enabled) return;
        if (!this._fillSbcFromFutbinCalled) {


            this._fillSbcFromFutbinButton = new UTStandardButtonControl();
            this._fillSbcFromFutbinButton.getRootElement().classList.add("call-to-action");
            this._fillSbcFromFutbinButton.init();
            this._fillSbcFromFutbinButton.setText(localize('plugins.fillSbcFromFutbin.button.text'));
            this._fillSbcFromFutbinButton.addTarget(this, () => {
                fillSbcFromFutbin(count => {
                    this._fillSbcFromFutbinButton.setInteractionState(false);
                    this._fillSbcFromFutbinButton.setText(localize('plugins.fillSbcFromFutbin.button.textLoading').replace("{count}", count));
                }).then(() => {
                    this._fillSbcFromFutbinButton.setInteractionState(true);
                    this._fillSbcFromFutbinButton.setText(localize('plugins.fillSbcFromFutbin.button.text'));
                });
            }, EventType.TAP);
            this.__content.appendChild(this._fillSbcFromFutbinButton.getRootElement());


            on("appEnabled", () => $(this)._fillSbcFromFutbinButton.getRootElement().show());
            on("appDisabled", () => $(this)._fillSbcFromFutbinButton.getRootElement().hide());

            this._fillSbcFromFutbinCalled = true;
        }
    }

    const UTSBCSquadDetailPanelView_destroyGeneratedElements = UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements;
    UTSBCSquadDetailPanelView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTSBCSquadDetailPanelView_destroyGeneratedElements.call(this);

        if (this._fillSbcFromFutbinButton) {
            this._fillSbcFromFutbinButton.destroy();
        }
    }

    function getExportedSbcFromClipboard() {
        return new Promise((resolve, reject) => {
            navigator.permissions.query({ name: "clipboard-read" }).then(result => {
                if (result.state === "granted" || result.state === "prompt") {
                    navigator.clipboard.readText().then(text => {
                        try {
                            let sbcData = JSON.parse(text);
                            resolve(sbcData.reverse());
                        }
                        catch
                        {
                            reject();
                        }
                    });
                }
            });
        });
    }

    function fillSbcFromFutbin(onClubBatchLoadedCallback) {
        return new Promise((resolve, reject) => {
            getExportedSbcFromClipboard().then(sbcData => {

                const playerIds = sbcData.map(x => parseInt(x[1]));
    
                getAllClubPlayers(false, null, onClubBatchLoadedCallback).then(club => {
                    const { _squad, _challenge } = getCurrentController()._leftController;
    
                    let foundPlayers = club.filter(x => playerIds.includes(x.definitionId));
    
                    let conceptPlayerIds = playerIds.filter(x => foundPlayers.filter(x => x.definitionId == x).length == 0);
    
                    getConceptPlayers(conceptPlayerIds).then(conceptPlayers => {
                        for (let conceptPlayer of conceptPlayers) {
                            foundPlayers.push(conceptPlayer);
                        }
    
                        const players = new Array(11);
                        for (let sbcIndex = 0; sbcIndex < sbcData.length; sbcIndex++) {
                            players[sbcIndex] = foundPlayers.find(x => x.definitionId === parseInt(sbcData[sbcIndex][1]));
                        }
    
                        _squad.setPlayers(players, true);
                        services.SBC.saveChallenge(_challenge);
                        resolve();
                    });
                });
            }).catch(reject);
        });
        
    }

    addStyle("paletools-fill-sbc-from-futbin", styles);
}

function menu() {
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });

    addLabelWithLink(container,
        "plugins.fillSbcFromFutbin.settings.importToolLabel",
        "plugins.fillSbcFromFutbin.settings.importToolLinkText",
        "javascript:(function()%7B(function()%7Bfunction%20copyToClipboard(str)%20%7Bconst%20el%20%3D%20document.createElement('textarea')%3Bel.value%20%3D%20str%3Bel.setAttribute('readonly'%2C%20'')%3Bel.style.position%20%3D%20'absolute'%3Bel.style.left%20%3D%20'-9999px'%3Bdocument.body.appendChild(el)%3Bel.select()%3Bdocument.execCommand('copy')%3Bdocument.body.removeChild(el)%3B%7Dfunction%20copySbcToClipboard()%7Blet%20isSbcUrl%20%3D%20%2Fhttps%5C%3A%5C%2F%5C%2Fwww.futbin.com%5C%2F%5Cd%2B%5C%2Fsquad%5C%2F%5Cd%2B%5C%2Fsbc%2F.test(location.href)%3Bif(!isSbcUrl)%7Balert(%22%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%20PALETOOLS%20ALERT%20%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%5Cn%5CnYou%20need%20to%20be%20in%20an%20SBC%20solution%20for%20this%20tool%20to%20work!%5Cn%5Cn%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%5Cn%5Cn%C2%A1Usted%20necesita%20estar%20en%20una%20soluci%C3%B3n%20de%20SBC%20para%20que%20funcione%20esta%20herramienta!%22)%3Breturn%3B%7Dlet%20data%20%3D%20%5B%5D%3B%24(%22%5Bdata-cardid%5D%22).each(function()%7Blet%20resourceIdDiv%20%3D%20%24(%22%5Bdata-resourceid-id%5D%22%2C%20this)%3Bif(resourceIdDiv.length%20%3E%200)%7Bdata.push(%5Bthis.dataset.formpos%2C%20resourceIdDiv%5B0%5D.dataset.resourceidId%5D)%3B%7D%7D)%3BcopyToClipboard(JSON.stringify(data))%3Balert(%22%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%20PALETOOLS%20%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%5Cn%5CnSBC%20succesfully%20exported%2C%20now%20go%20to%20Paletools%20and%20hit%20import%20SBC%20from%20FUTBIN%20button%5Cn%5Cn%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%3D%5Cn%5CnSBC%20exportado%20correctamente%2C%20ahora%20ve%20a%20Paletools%20y%20presiona%20el%20boton%20importar%20SBC%20de%20FUTBIN%22)%3B%7DcopySbcToClipboard()%3B%7D)()%7D)()");

    const linkMessage = document.createElement("div");
    linkMessage.classList.add("install-instructions");
    linkMessage.textContent = localize('plugins.fillSbcFromFutbin.settings.installInstructions');
    container.appendChild(linkMessage);

    return container;
}

export default {
    run: run,
    order: 3,
    settings: {
        name: 'fill-sbc-from-futbin',
        title: 'plugins.fillSbcFromFutbin.settings.title',
        menu: menu
    }
};