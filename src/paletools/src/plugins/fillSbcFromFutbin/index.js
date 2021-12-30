let plugin;
/// #if process.env.FILL_SBC_FROM_FUTBIN
import { addLabelWithLink, addLabelWithToggle } from "../../controls";
import localize from "../../localization";
import { getAllClubPlayers, getClubPlayers, getUnnasignedPlayers } from "../../services/club";
import getCurrentController from "../../utils/controller";
import settings from "../../settings";
import { on } from "../../events";
import styles from "./styles.css";
import { addStyle } from "../../utils/styles";
import { getConceptPlayers } from "../../services/players";
import { notifyFailure } from "../../utils/notifications";

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
                            notifyFailure(localize("plugins.fillSbcFromFutbin.copyError"));
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

    const exportSbcCode = `
(function() {
	function copyToClipboard(str) {
		const el = document.createElement('textarea');
		el.value = str;
		el.setAttribute('readonly', '');
		el.style.position = 'absolute';
		el.style.left = '-9999px';
		document.body.appendChild(el);
		el.select();
		document.execCommand('copy');
		document.body.removeChild(el);
	}

	function copySbcToClipboard() {
		let isSbcUrl = /https\\:\\/\\/www.futbin.com\\/\\d+\\/squad\\/\\d+\\/sbc/.test(location.href);
		if (!isSbcUrl) {
			alert("========== PALETOOLS ALERT ==========\\n\\nYou need to be in an SBC solution for this tool to work!\\n\\n========================================\\n\\n¡Usted necesita estar en una solución de SBC para que funcione esta herramienta!");
			return;
		}
		let data = [];
		$("[data-cardid]").each(function() {
			let resourceIdDiv = $("[data-resourceid-id]", this);
			if (resourceIdDiv.length > 0) {
				data.push([this.dataset.formpos, resourceIdDiv[0].dataset.resourceidId]);
			}
		});
		copyToClipboard(JSON.stringify(data));
		alert("========== PALETOOLS ==========\\n\\nSBC succesfully exported, now go to Paletools and hit import SBC from FUTBIN button\\n\\n========================================\\n\\nSBC exportado correctamente, ahora ve a Paletools y presiona el boton importar SBC de FUTBIN");
	}
	copySbcToClipboard();
})()
`;

    addLabelWithLink(container,
        "plugins.fillSbcFromFutbin.settings.importToolLabel",
        "plugins.fillSbcFromFutbin.settings.importToolLinkText",
        `javascript:eval(atob('${btoa(exportSbcCode)}'))`);

    const linkMessage = document.createElement("div");
    linkMessage.classList.add("install-instructions");
    linkMessage.innerHTML = localize('plugins.fillSbcFromFutbin.settings.installInstructions');
    container.appendChild(linkMessage);

    return container;
}

plugin = {
    run: run,
    order: 3,
    settings: {
        name: 'fill-sbc-from-futbin',
        title: 'plugins.fillSbcFromFutbin.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;