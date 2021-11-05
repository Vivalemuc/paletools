import VERSION from "../../version";
import { addStyle } from "../../utils/styles";
import styles from "./styles.css";

export default function runDonation() {
    $(".ut-fifa-header-view").append(`<div id="palesnipe-donation-ui" class="palesnipe-element">
            <h3 class="title">${VERSION} - Powered by Paletools</h3>
            <div><a href="https://streamlabs.com/paleta_ar/tip" target="_blank">PayPal Donation</a></div>
            <div><a href="https://ceneka.net/mp/d/paletaeaa" target="_blank">MercadoPago Donation</a></div>
            <div>Follow me at&nbsp;<a href="https://twitter.com/paleta" target="_blank">@paleta</a></div>
        </div>`);

    addStyle('paletools-donation', styles);
}