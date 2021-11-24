
let plugin;

/// #if process.env.IMPROVED_PLAYER_SEARCH
import { addLabelWithToggle } from "../../controls";
import settings from "../../settings";
import { removeDiacritics } from "../../utils/diacritics";
const cfg = settings.plugins.improvedPlayerSearch;

function run() {
    function ImprovedSearchEngine() {
        this._players = repositories.Item.getStaticData();

        for(const player of this._players){
            player.cleanedLastName = removeDiacritics(player.lastName);
            player.cleanedFirstName = removeDiacritics(player.firstName);
            player.cleanedCommonName = player.commonName ? removeDiacritics(player.commonName) : player.commonName;
        }
    }

    ImprovedSearchEngine.prototype.getEntriesForString = function (str) {
        if (str.length <= 1) return [];

        str = str.toLowerCase();
        let where = null;
        let sort = null;

        let nameSort = (a, b) => {
            let textA = a.commonName ? a.commonName : a.firstName + a.lastName;
            let textB = b.commonName ? b.commonName : b.firstName + b.lastName;
            return textA < textB ? -1 : textA > textB ? 1 : 0;
        }
        let ratingSort = (a, b) => {
            if (a.rating === b.rating) {
                return nameSort(a, b);
            }

            return b.rating - a.rating;
        }

        if (!Number.isNaN(parseInt(str))) {
            let rating = Math.abs(parseInt(str));
            sort = ratingSort;
            if (str.charAt(0) === "+") {
                where = x => x.rating >= rating;
            }
            else if (str.charAt(0) === "-") {
                where = x => x.rating <= rating;
            }
            else {
                where = x => x.rating == rating;
                sort = nameSort;
            }
        }
        else {
            where = x => x.cleanedLastName.toLowerCase().indexOf(str) > -1
                || x.cleanedFirstName.toLowerCase().indexOf(str) > -1
                || (x.commonName && x.cleanedCommonName.toLowerCase().indexOf(str) > -1);
            sort = ratingSort;
        }

        return this._players.filter(where).sort(sort);
    }

    const UTPlayerSearchControl_init = UTPlayerSearchControl.prototype.init
    UTPlayerSearchControl.prototype.init = function () {
        UTPlayerSearchControl_init.call(this);
        if (settings.enabled && cfg.enabled) {
            this.searchEngine = new ImprovedSearchEngine();
        }
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


plugin = {
    run: run,
    order: 10,
    settings: {
        name: 'improved-player-search',
        title: 'plugins.improvedPlayerSearch.settings.title',
        menu: menu
    }
};
/// #endif

export default plugin;