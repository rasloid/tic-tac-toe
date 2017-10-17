const EventEmitter = require('events').EventEmitter;

const users = {};


class UsersManager extends EventEmitter{

    constructor(){
        super();
    }

    isNicknameFree(nickname){
        return !this._users[nickname];
    }

    getOpponent(nickname){
        const opponent = this._users[nickname];
        if(opponent && opponent._isBusy()){
            return null;
        }
        return opponent;
    }

    getUsersList(){
        return this._users;
    }
    removeUser(user){
        const sentRequestTo = this._users[user.sentRequestTo];
        if(sentRequestTo){
            sentRequestTo.receivedRequestFrom = null;
        }
        const receivedRequestFrom = this._users[user.receivedRequestFrom];
        if(receivedRequestFrom){
            receivedRequestFrom.sentRequestTo = null;
        }
        delete this._users[user.nickname];
        this._propagateUpdates();
    }

    addUser(nickname,socketId){
        if(this._users[nickname]){
            return null;
        }
        const user = this._users[nickname] = new User(nickname, socketId);
        this._propagateUpdates();
        user.on('update', this._propagateUpdates.bind(this));
        return user;
    }

    startGame(player1,player2,gameId){
        player1._startGame(player2,gameId);
        player2._startGame(player1,gameId);
        this._propagateUpdates();

    }

    endGame(user){
        if(!user.gameId){
            return
        }
        const opponent = this._users[user.opponentNickname];
        if(opponent){
            opponent._endGame()
        }
        user._endGame();

        this._propagateUpdates();
    }

    _propagateUpdates(){
        console.log('users storage update event');
        this.emit('update',this._users);
    }

}

module.exports = new UsersManager;