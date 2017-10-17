const db = require('redis-promisify').createClient();

async function createGame(nickname1,nickname2,gameId){
    const game = {};
    game.player1 = nickname1;
    game.player2 = nickname2;
    setStartState(game);
    await db.setAsync(`games:${gameId}`,JSON.stringify(game));
    return game;
}

async function getGameData(gameId){
    let game = await db.getAsync(`games:${gameId}`);
    return JSON.parse(game);
}

function deleteGame(gameId){
    db.delAsync(`games:${gameId}`)
        .catch(console.log);
}

async function nextTurn(gameId,data){
    const game = await getGameData(gameId);
    if(+game.turn.slice(-1) != data.playerNum){
        return game;
    }
    game.playFieldState[data.index] = data.playerNum;
    let status = checkPlayField(game.playFieldState);

    switch (status) {
        case 'whoseTurn':
            game.winner = game.turn;
            break;
        case 'draw':
            this.draw = true;
            break;
        default:
            game.turn = game.turn == 'player1' ? 'player2' : 'player1';
    }
    await  setGameData(gameId, game);
    return game;
}

async function resumeGame(gameId){
    const game = await getGameData(gameId);
    setStartState(game);
    await setGameData(gameId, game);
    return game;
}



function setGameData(gameId, data){
    return db.setAsync(`games:${gameId}`, JSON.stringify(data));
}

function setStartState(game){
    game.playFieldState = [0, 0, 0, 0, 0, 0, 0, 0, 0];
    game.turn = 'player1';
    game.winner = null;
    game.draw = false;
}

function checkPlayField(f){
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
        return 'whoseTurn';
    }
    if (cellsFilled == 9) {
        return 'draw';
    }
}

module.exports.resumeGame = resumeGame;
module.exports.nextTurn = nextTurn;
module.exports.createGame = createGame;
module.exports.getGameData =getGameData;
module.exports.deleteGame = deleteGame;