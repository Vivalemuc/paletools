import runPlugins from "./plugins";
import { triggerEvent } from "./events";
import { addStyle } from "./utils/styles";
import styles from "./styles.css";
import getCurrentController from "./utils/controller";

runPlugins();
let currentController = getCurrentController();
getAppMain().getRootViewController().showGameView();
setTimeout(() => {
    getCurrentController().getNavigationController()._showController(currentController);
}, 1000);
addStyle("paletools", styles);
triggerEvent('paletools:loaded');

