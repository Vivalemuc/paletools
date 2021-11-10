import delay from "../utils/delay";

export function getConceptPlayers(playerIds){
    let promises = [];
    for(let playerId of playerIds){
        promises.push(getConceptPlayer(playerId));
    }

    return Promise.all(promises);
}

export function getConceptPlayer(playerId){
    return new Promise(resolve => {
        playerId = parseInt(playerId);

        getConceptPlayersByDefinitionId(playerId).then(players => {
            let player = players.find(x => x.definitionId === playerId)
            resolve(player);
        });
    });
}

function getConceptPlayersByDefinitionId(playerId) {
    return new Promise((resolve, reject) => {
      const searchCriteria = new viewmodels.BucketedItemSearch().searchCriteria;
      if (playerId) {
        searchCriteria.defId = [playerId];
      }
      const gatheredPlayers = [];
  
      const getAllConceptPlayers = () => {
        services.Item.searchConceptItems(searchCriteria).observe(
          this,
          async function (sender, response) {
            gatheredPlayers.push(...response.data.items);
            if (response.status !== 400 && !response.data.endOfList) {
              searchCriteria.offset += searchCriteria.count;
              delay(100).then(() => getAllConceptPlayers());
            } else {
              resolve(gatheredPlayers);
            }
          }
        );
      };
      getAllConceptPlayers();
    });
  };