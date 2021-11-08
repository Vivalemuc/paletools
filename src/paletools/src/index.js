import runPlugins from "./plugins";
import { triggerEvent } from "./events";
import { addStyle } from "./utils/styles";
import styles from "./styles.css";

runPlugins();
getAppMain().getRootViewController().showGameView();
addStyle("paletools", styles);
triggerEvent('paletools:loaded');

