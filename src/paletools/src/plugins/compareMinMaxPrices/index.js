import settings, { saveConfiguration } from "../../settings";
import { addStyle } from "../../utils/styles";
import styles from "./styles.css";
import { addLabelWithToggle } from "../../controls";
import localize from "../../localization";

const cfg = settings.plugins.compareMinMaxPrices;

function run() {
    const UTMarketSearchView__generate = UTMarketSearchView.prototype._generate;
    UTMarketSearchView.prototype._generate = function _generate() {
        UTMarketSearchView__generate.call(this);
        if (!this._generateCompareMinMaxPrices) {
            if (cfg.enabled) {
                this._minMaxPriceContainer = document.createElement("div");
                this._minPriceText = document.createElement("span");
                this._minPriceText.classList.add("min-price-value");
                this._maxPriceText = document.createElement("span");
                this._maxPriceText.classList.add("max-price-value");
                const minPriceContainer = document.createElement("span");
                minPriceContainer.classList.add("min-price");
                $(minPriceContainer)
                    .append(`<span class="min-price-label">${localize("plugins.compareMinMaxPrices.minPriceLabel")}</span>`)
                    .append(this._minPriceText);
                const maxPriceContainer = document.createElement("span");
                maxPriceContainer.classList.add("max-price");
                $(maxPriceContainer)
                    .append(`<span class="max-price-label">${localize("plugins.compareMinMaxPrices.maxPriceLabel")}</span>`)
                    .append(this._maxPriceText);


                $(this._minMaxPriceContainer)
                    .addClass("min-max-prices")
                    .addClass("palesnipe-element")
                    .hide()
                    .append(minPriceContainer)
                    .append(maxPriceContainer)
                    .insertBefore(this._list.getRootElement());

                this._minBuyNowPrice = Number.MAX_VALUE;
                this._maxBuyNowPrice = 0;
            }

            this._generateCompareMinMaxPrices = true;
        }
    }

    const UTMarketSearchView_setItems = UTMarketSearchView.prototype.setItems;
    UTMarketSearchView.prototype.setItems = function setItems(e, t) {
        if (cfg.enabled) {
            if (this._superview
                && this._superview._superview
                && this._superview._superview._rView instanceof UTNavigationContainerView) {
                for (let entity of e) {
                    if (entity._auction.buyNowPrice > this._maxBuyNowPrice) {
                        this._maxBuyNowPrice = entity._auction.buyNowPrice;
                    }
                    if (entity._auction.buyNowPrice < this._minBuyNowPrice) {
                        this._minBuyNowPrice = entity._auction.buyNowPrice;
                    }
                }
                this._minPriceText.textContent = this._minBuyNowPrice;
                this._maxPriceText.textContent = this._maxBuyNowPrice;
                $(this._minMaxPriceContainer).show();
            }
            else {
                $(this._minMaxPriceContainer).hide();
            }
        }

        UTMarketSearchView_setItems.call(this, e, t);
    }

    addStyle('paletools-compare-min-max-prices', styles);
}

function menu(){
    const container = document.createElement("div");
    addLabelWithToggle(container, "enabled", cfg.enabled, toggleState => {
        cfg.enabled = toggleState;
        saveConfiguration();
    });
    return container;
}

export default {
    run: run,
    order: 1,
    settings: {
        name: 'compare-min-max-prices',
        title: 'plugins.compareMinMaxPrices.settings.title',
        menu: menu
    }
};