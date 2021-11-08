import VERSION from "../../version";
import { addStyle } from "../../utils/styles";
import styles from "./styles.css";
import localize from "../../localization";

function run() {
    $(".ut-fifa-header-view").append(`<div id="palesnipe-donation-ui" class="palesnipe-element">
            <h3 class="title">v${VERSION} - ${localize('plugins.donation.title')}</h3>
            <div><a href="https://streamlabs.com/paleta_ar/tip" target="_blank">${localize('plugins.donation.paypal')}</a></div>
            <div><a href="https://ceneka.net/mp/d/paletaeaa" target="_blank">${localize('plugins.donation.mercadopago')}</a></div>
            <div>Follow me at&nbsp;<a href="https://twitter.com/paleta" target="_blank">@paleta</a></div>
        </div>`);

    addStyle('paletools-donation', styles);
}

export default {
    run: run,
    order: 2
};