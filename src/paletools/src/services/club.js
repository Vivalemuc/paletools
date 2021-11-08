import { triggerEvent } from "../events";
import http from "./http";

const MAX_ITEMS_REQUEST = 150;

export function getClubPlayers(playerIds) {
    return new Promise(resolve => {
        const players = [];
        const promises = [];
        for (const playerId of playerIds) {
            promises.push(getAllClubPlayers(true, playerId));
        }

        Promise.all(promises).then(results => {
            for (const result of results) {
                players.push(result[0]);
            }

            resolve(players);
        });
    });
}

export function getAllClubPlayers(filterLoaned, playerId, onBachLoadedCallback) {
    return new Promise((resolve, reject) => {
        const searchCriteria = new viewmodels.BucketedItemSearch().searchCriteria;
        if (playerId) {
            searchCriteria.defId = [parseInt(playerId)];
        }
        searchCriteria.count = MAX_ITEMS_REQUEST;
        let gatheredSquad = [];

        const getAllSquadMembers = () => {
            services.Item.searchClub(searchCriteria).observe(
                this,
                async function (sender, response) {
                    gatheredSquad = [
                        ...response.data.items.filter(
                            (item) => !filterLoaned || item.loans < 0
                        ),
                    ];
                    if (response.status !== 400 && !response.data.retrievedAll) {
                        searchCriteria.offset += searchCriteria.count;
                        if(onBachLoadedCallback){
                            (onBachLoadedCallback)(searchCriteria.offset);    
                        }
                        getAllSquadMembers();
                    } else {
                        if(onBachLoadedCallback){
                            (onBachLoadedCallback)(searchCriteria.offset);    
                        }
                        resolve(gatheredSquad);
                    }
                }
            );
        };
        getAllSquadMembers();
    });
};

export function getUnnasignedPlayers() {
    return http('purchased/items');
}
