import settings from "../../settings";
import getCurrentController from "../../utils/controller";
import { notifySuccess } from "../../utils/notifications";
import { addStyle } from "../../utils/styles";
import styles from "./styles.css";

export default function runMarketSearchFilters() {
    const UTMarketSearchFiltersView__generate = UTMarketSearchFiltersView.prototype._generate
    UTMarketSearchFiltersView.prototype._generate = function _generate() {
        function createContainer(child) {
            const container = document.createElement("div");
            container.classList.add("inline-list-select");
            container.classList.add("ut-player-search-control");
            const inlineContainer = document.createElement("div")
            inlineContainer.classList.add("inline-container");
            container.appendChild(inlineContainer);
            const inlineInlineContainer = document.createElement("div");
            inlineContainer.appendChild(inlineInlineContainer);
            inlineInlineContainer.classList.add("ut-player-search-control--input-container");
            inlineInlineContainer.appendChild(child);
            return container;
        }

        UTMarketSearchFiltersView__generate.call(this);
        if (!this._generateMarketSearchFilters) {
            const container = document.createElement("div");
            $(container).addClass("ut-item-search-view").addClass("palesnipe-element");

            if (settings.palesnipe.plugins.savedFilters) {

                let filtersContainer = document.createElement("div");
                filtersContainer.classList.add("saved-filters");

                this._filterName = new UTTextInputControl();
                this._filterName.init();
                this._filterName.setPlaceholder("Filter name");

                this._saveFilterButton = new UTStandardButtonControl();
                this._saveFilterButton.init();
                this._saveFilterButton.setText("Save");
                this._saveFilterButton.addTarget(this, this.saveFilter, EventType.TAP);

                this._deleteFilterButton = new UTStandardButtonControl();
                this._deleteFilterButton.init();
                this._deleteFilterButton.setText("Delete");
                this._deleteFilterButton.addTarget(this, this.deleteFilter, EventType.TAP);

                this._savedFilters = new UTDropDownControl();
                this._savedFilters.init();
                this._savedFilters.addTarget(this, this.onSavedFiltersChange, EventType.CHANGE);

                $(filtersContainer)
                    .append(this._filterName.getRootElement())
                    .append(this._saveFilterButton.getRootElement())
                    .append(this._deleteFilterButton.getRootElement())
                    .append(this._savedFilters.getRootElement());

                container.appendChild(filtersContainer);

                this.loadSavedFilters();
            }

            if (settings.palesnipe.plugins.playerIdFilter) {
                this._playerId = new UTTextInputControl();
                const playerIdContainer = createContainer(this._playerId.getRootElement());
                this._playerId.init();
                this._playerId.setPlaceholder("Player ID");
                this._playerId.setMaxLength(25);
                this._playerId.addTarget(this, this.handlePlayerIdChange, EventType.CHANGE);
                container.appendChild(playerIdContainer);
            }

            if (settings.palesnipe.plugins.playerRatingFilter) {
                this._playerRating = new UTTextInputControl();
                const playerRatingContainer = createContainer(this._playerRating.getRootElement());
                this._playerRating.init();
                this._playerRating.setPlaceholder("Player Rating");
                this._playerRating.setMaxLength(3);
                this._playerRating.addTarget(this, this.handlePlayerRatingChange, EventType.CHANGE);

                container.appendChild(playerRatingContainer);
            }

            $(container).insertBefore($(".ut-item-search-view", this.__root));

            this._generateMarketSearchFilters = true;
        }
    }

    UTMarketSearchFiltersView.prototype.getStoredFilters = function () {
        const data = localStorage.getItem("paletools:searchFilters");
        if (!data) return {};
        return JSON.parse(atob(data)) || {};
    }

    UTMarketSearchFiltersView.prototype.saveFilters = function (filters) {
        localStorage.setItem("paletools:searchFilters", btoa(JSON.stringify(filters)));
    }

    UTMarketSearchFiltersView.prototype.loadSavedFilters = function () {
        const searchFilters = this.getStoredFilters();
        let filters = [{ label: '-- Select a filter to load --', value: '' }];
        for (let filterKey of Object.keys(searchFilters).sort()) {
            filters.push({ label: searchFilters[filterKey].name, value: filterKey });
        }
        this._savedFilters.setOptions(filters);
    }

    UTMarketSearchFiltersView.prototype.saveFilter = function () {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            const searchCriteria = controller._viewmodel.searchCriteria;
            const name = this._filterName.getValue();
            const key = name.replace(/[^a-z0-9]/gi, '_').toLowerCase();
            const filters = this.getStoredFilters();
            searchCriteria.rating = this._playerRating.getValue();
            filters[key] = { name: name, criteria: searchCriteria };
            this.saveFilters(filters);
            this.loadSavedFilters();
            notifySuccess("Filter saved");
        }
    }

    UTMarketSearchFiltersView.prototype.deleteFilter = function () {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            const filterKey = this._savedFilters.getValue();
            if (!filterKey) return;
            const filters = this.getStoredFilters();
            delete filters[filterKey];
            this.saveFilters(filters);
            this.loadSavedFilters();
            notifySuccess("Filter deleted");
        }
    }

    UTMarketSearchFiltersView.prototype.loadFilter = function (filter) {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            if (filter.criteria.defId && filter.criteria.defId.length > 0) {
                this._playerId.setValue(filter.criteria.defId[0]);
            }
            if (filter.criteria.rating) {
                this._playerRating.setValue(filter.criteria.rating);
            }
            for (let key of Object.keys(filter.criteria)) {
                controller._viewmodel.searchCriteria[key] = filter.criteria[key];
                this.setFilters(controller._viewmodel);
            }
        }
    }

    const UTMarketSearchFiltersView_setFilters = UTMarketSearchFiltersView.prototype.setFilters;
    UTMarketSearchFiltersView.prototype.setFilters = function setFilters(e, t) {
        if (settings.enabled && settings.palesnipe.plugins.playerIdFilter && e.searchCriteria.defId && e.searchCriteria.defId.length > 0) {
            this._playerId.setValue(e.searchCriteria.defId[0])
        }
        if (settings.enabled && settings.palesnipe.plugins.playerRatingFilter && e.searchCriteria.rating) {
            this._playerRating.setValue(e.searchCriteria.rating);
        }
        UTMarketSearchFiltersView_setFilters.call(this, e, t);
    }

    const UTMarketSearchFiltersView_destroyGeneratedElements = UTMarketSearchFiltersView.prototype.destroyGeneratedElements;
    UTMarketSearchFiltersView.prototype.destroyGeneratedElements = function destroyGeneratedElements() {
        UTMarketSearchFiltersView_destroyGeneratedElements.call(this);
        if (this._playerId) {
            this._playerId.destroy();
        }

        if (this._playerRating) {
            this._playerRating.destroy();
        }

        if (this._filterName) {
            this._filterName.destroy();
            this._saveFilterButton.destroy();
            this._deleteFilterButton.destroy();
            this._savedFilters.destroy();
        }
    }

    UTMarketSearchFiltersView.prototype.handlePlayerIdChange = function (_, __, elem) {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            controller._viewmodel.searchCriteria.defId = [elem.value];
        }
    }

    UTMarketSearchFiltersView.prototype.handlePlayerRatingChange = function (_, __, elem) {
        const controller = getCurrentController();
        if (controller instanceof UTMarketSearchFiltersViewController) {
            controller._viewmodel.searchCriteria.rating = elem.value;
        }
    }

    UTMarketSearchFiltersView.prototype.onSavedFiltersChange = function (_, __, elem) {
        const filters = this.getStoredFilters();
        if (filters[elem.value]) {
            this.loadFilter(filters[elem.value]);
        }
        else {
            const controller = getCurrentController();
            if (controller instanceof UTMarketSearchFiltersViewController) {
                controller._eResetSelected();
            }
        }
    }

    const UTMarketSearchFiltersViewController__eResetSelected = UTMarketSearchFiltersViewController.prototype._eResetSelected;
    UTMarketSearchFiltersViewController.prototype._eResetSelected = function _eResetSelected() {
        if (this.getView()._playerId) {
            this.getView()._playerId.clear();
        }
        if (this.getView()._playerRating) {
            this.getView()._playerRating.clear();
        }
        if (this.getView()._filterName) {
            this.getView()._filterName.clear();
        }

        UTMarketSearchFiltersViewController__eResetSelected.call(this);
    }

    const UTPaginatedItemListView_setItems = UTPaginatedItemListView.prototype.setItems;
    UTPaginatedItemListView.prototype.setItems = function (e, i) {
        const controller = getCurrentController();
        if (settings.enabled && controller._listController && controller._listController && controller._listController._searchCriteria) {
            var o = this;
            this.removeListRows();

            e.forEach(function (e) {
                if (shouldRenderItem(e, controller._listController._searchCriteria)) {
                    var t = new UTItemTableCellView;
                    t.setData(e, void 0, void 0, i),
                        o.listRows.push(t)
                }
            });

            return this.listRows;
        }
        else {
            return UTPaginatedItemListView_setItems.call(this, e, i);
        }
    }

    const UTItemTableCellView_render = UTItemTableCellView.prototype.render;
    UTItemTableCellView.prototype.render = function (e) {
        UTItemTableCellView_render.call(this, e);
        if (settings.enabled && this.data.isPlayer() && _palesnipeSettings.plugins.playerIdValue) {
            $(".ut-item-view--main", this.__entityContainer).append(`<span class="player-definition-id">${this.data.definitionId}</span>`);
        }
    }

    function shouldRenderItem(item, searchCriteria) {
        let rating = searchCriteria.rating;

        if (!settings.enabled || !rating || !_palesnipeSettings.plugins.playerRatingFilter) return true;

        if (rating.charAt(0) === "+") {
            rating = parseInt(rating.substr(1));
            return item.rating >= rating;
        }
        else if (rating.charAt(0) === "-") {
            rating = parseInt(rating.substr(1));
            return item.rating <= rating;
        }
        else {
            rating = parseInt(rating);
            return item.rating == rating;
        }
    }

    addStyle('paletools-marketsearch-filters', styles);
}