/// #if process.env.CLUB_ANALYZER
export default class ClubAnalyzerViewModel {
    constructor() {
        this.players = {
            all: {},
            byNation: {},
            byLeague: {},
            byRating: {},
            byRarity: {},
            unnasigned: {
                all: {},
                tradeable: {},
                untradeable: {}
            },
            tradepile: {},
            watchlistWon: {},
            watchlistWinning: {},
            watchlistLoosing: {},
            watchlistLost: {}
        };

        this.counters = {
            special: 0,
            rare: {
                gold: 0,
                silver: 0,
                bronze: 0,
                ucl: 0
            },
            common: {
                gold: 0,
                silver: 0,
                bronze: 0,
                ucl: 0
            },
            libertadores: {
                gold: 0,
                silver: 0,
                bronze: 0
            },
            sudamericana: {
                gold: 0,
                silver: 0,
                bronze: 0
            },
            unnasignedTotal: 0,
            watchlistTotal: 0,
            tradepileTotal: 0
        };
    }
};
/// #endif