const io = require('socket.io-emitter')({ host: '127.0.0.1', port: 6379 });
const db = require('redis-promisify').createClient();
const uuidv4 = require('uuid/v4');
const EventEmitter = require('events').EventEmitter;

class UsersManager extends EventEmitter {

    constructor() {
        super();
    }

    async addUser(nickname,socketId){
        try {
            const user = await db.hgetAsync(`users:${nickname}`,'nickname');
            console.log(`USER - ${user}`);
            if (user) {
                return null;
            }
            await Promise.all([
                db.hsetAsync(`users:${nickname}`, 'nickname', nickname),
                db.hsetAsync(`users:${nickname}`, 'socketId', socketId),
                db.hsetAsync('users list', nickname, 'false')]);
            this._propagateUpdates();
            return nickname;
        }catch(e){
            console.log(e);
        }

    }

    async removeUser(nickname){
        try {
            await this.clearGameRequest(nickname);
            await this.exitGame(nickname);
            await db.delAsync(`users:${nickname}`);
            await this._propagateUpdates();
        }catch(e){
            console.log(e);
        }
    }

    async joinGame(nickname1,nickname2,gameId){
        await Promise.all([
            db.hsetAsync(`users:${nickname1}`, 'opponentNickname', nickname2),
            db.hsetAsync(`users:${nickname2}`, 'opponentNickname', nickname1),
            db.hsetAsync(`users:${nickname1}`, 'gameId', gameId),
            db.hsetAsync(`users:${nickname2}`, 'gameId', gameId)]);
        return this.clearGameRequest(nickname1);
    }

    async exitGame(nickname){
        try {
            const user = await db.hgetallAsync(`users:${nickname}`);
            if (!user) {
                return null;
            }
            const opponentNickname = user.opponentNickname;
            await this._propagateUpdates();
            if (!opponentNickname) {
                return null;
            }
            await this.deleteUserData(nickname,'gameId','opponentNickname','resumeGameAccept');
            return this.exitGame(opponentNickname);
        }catch(e){
            console.log(e);
        }
    }

    async gameRequest(initiatorNickname, targetNickname){
        await Promise.all([
            db.hsetAsync(`users:${initiatorNickname}`,'sentRequestTo', targetNickname),
            db.hsetAsync(`users:${targetNickname}`,'receivedRequestFrom', initiatorNickname)
        ]);
        return this._propagateUpdates();
    }

    async clearGameRequest(nickname){
        try {
            const user = await db.hgetallAsync(`users:${nickname}`);
            const targetNickname = user.sentRequestTo;
            const initiatorNickname = user.receivedRequestFrom;
            if (targetNickname) {
                await db.hdelAsync(`users:${nickname}`, 'sentRequestTo');
                await db.hdelAsync(`users:${targetNickname}`, 'receivedRequestFrom');
            }
            if (initiatorNickname) {
                await db.hdelAsync(`users:${nickname}`, 'receivedRequestFrom');
                await db.hdelAsync(`users:${targetNickname}`, 'sentRequestTo');
            }
            return this._propagateUpdates();
        }catch(e){
            console.log(e);
        }

    }

    isBusy(nickname){
        return this.getUserData(nickname)
            .then(data => {
                return !!data.opponentNickname || !!data.sentRequestTo || !!data.receivedRequestFrom;
            });

    }

    getUserData(nickname){
        return db.hgetallAsync(`users:${nickname}`);
    }

    setUserData(nickname,data){
        const promisesArr = [];
        for(let prop in data){
            promisesArr.push(db.hsetAsync(`users:${nickname}`, prop, data[prop]))
        }
        return Promise.all(promisesArr);
    }

    deleteUserData(nickname,...userProps){
        return Promise.all(userProps.map(prop =>
            db.hdelAsync(`users:${nickname}`,prop)
        ));
    }

    setResumeGameAccept(nickname, value){
        users[nickname].resumeGameAccept = value;
    }

    getResumeGameAccept(nickname){
        return users[nickname].resumeGameAccept;
    }

    async _propagateUpdates(){
        try {
            const usersList = await db.hgetallAsync('users list');
            io.to('authorized_users_room').emit('users list update', usersList);
            //io.to('authorized_users_room').emit('debug event');
        }catch(e){
            console.log(e);
        }
    }

}

module.exports = new UsersManager;