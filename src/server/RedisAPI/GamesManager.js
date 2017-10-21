const redis = require('redis-promisify');

class GamesManager {
    constructor(redisOptions){
        this.db = redis.createClient(redisOptions);
    }
    
    async createGame(nickname1, nickname2, gameId) {
        const game = {};
        game.player1 = nickname1;
        game.player2 = nickname2;
        this.setStartState(game);
        await this.db.setAsync(`games:${gameId}`, JSON.stringify(game));
        return game;
    }

    async getGameData(gameId) {
        let game = await this.db.getAsync(`games:${gameId}`);
        return JSON.parse(game);
    }

    deleteGame(gameId) {
        this.db.delAsync(`games:${gameId}`)
            .catch(console.log);
    }

    async nextTurn(gameId, data) {
        const game = await
        this.getGameData(gameId);
        //console.log('nextTurn method', 'gameId',gameId,'gameData',game);
        if (+game.turn.slice(-1) != data.playerNum) {
            return game;
        }
        game.playFieldState[data.index] = data.playerNum;
        let status = this.checkPlayField(game.playFieldState);

        switch (status) {
            case 'whose_turn':
                game.winner = game.turn;
                break;
            case 'draw':
                game.draw = true;
                break;
            default:
                game.turn = game.turn == 'player1' ? 'player2' : 'player1';
        }
        await this.setGameData(gameId, game);
        return game;
    }

    async resumeGame(gameId) {
        const game = await this.getGameData(gameId);
        this.setStartState(game);
        await this.setGameData(gameId, game);
        return game;
    }

    setGameData(gameId, data) {
        return this.db.setAsync(`games:${gameId}`, JSON.stringify(data));
    }

    setStartState(game) {
        game.playFieldState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
        game.turn = 'player1';
        game.winner = null;
        game.draw = false;
    }

    checkPlayField(f) {
        let cellsFilled = 0;
        f.forEach(cell => {
            if (cell) cellsFilled++;
        });
        if (cellsFilled < 5) return;
        if (
            f[0] == f[1] && f[1] == f[2] && f[0] != 0 ||
            f[0] == f[4] && f[4] == f[8] && f[0] != 0 ||
            f[0] == f[3] && f[3] == f[6] && f[0] != 0 ||
            f[1] == f[4] && f[4] == f[7] && f[1] != 0 ||
            f[2] == f[5] && f[5] == f[8] && f[2] != 0 ||
            f[2] == f[4] && f[4] == f[6] && f[2] != 0 ||
            f[3] == f[4] && f[4] == f[5] && f[3] != 0 ||
            f[6] == f[7] && f[7] == f[8] && f[6] != 0) {
            return 'whose_turn';
        }
        if (cellsFilled == 9) {
            return 'draw';
        }
    }
}

module.exports = GamesManager;