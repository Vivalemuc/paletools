import runPlugins from "./plugins";
import { EVENTS, triggerEvent } from "./events";
import { addStyle } from "./utils/styles";
import styles from "./styles.css";
import getCurrentController from "./utils/controller";

let initialized = false;
function init() {

    //reset console
    var iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);
    window.console = iframe.contentWindow.console;

    if(!services.Localization) {
        setTimeout(init, 1000);
        return;
    }

    runPlugins();
    //let currentController = getCurrentController();
    getAppMain().getRootViewController().showGameView();
    // setTimeout(() => {
    //     getCurrentController().getNavigationController()._showController(currentController);
    // }, 1000);
    addStyle("paletools", styles);
    triggerEvent(EVENTS.APP_STARTED);
    initialized = true;
}

init();