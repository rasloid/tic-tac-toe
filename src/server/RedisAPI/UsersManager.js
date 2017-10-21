const ioe = require('socket.io-emitter');
const redis = require('redis-promisify');

class UsersManager{
    constructor(redisOptions){
        let p = new Promise((res, rej)=>{
            this.db = redis.createClient(redisOptions);
            this.db.on('ready', ()=>res());
        });
        p.then(()=>{
            this.io = ioe(this.db);
        }).catch(console.log);
    }

    async addUser(nickname,socketId){
        try {
            const user = await this.db.hgetAsync(`users:${nickname}`,'nickname');
            if (user) {
                return null;
            }
            await Promise.all([
                this.db.hsetAsync(`users:${nickname}`, 'nickname', nickname),
                this.db.hsetAsync(`users:${nickname}`, 'socketId', socketId),
                this.db.hsetAsync('users list', nickname, '')]);
            this.propagateUpdates();
            return nickname;
        }catch(e){
            console.log(e);
        }
    }

    async removeUser(nickname){
        try {
            await this.clearGameRequest(nickname);
            await this.exitGame(nickname);
            await this.db.delAsync(`users:${nickname}`);
            await this.db.hdelAsync('users list', nickname);
            await this.propagateUpdates();
        }catch(e){
            console.log(e);
        }
    }

    async joinGame(nickname1,nickname2,gameId){
        await Promise.all([
            this.db.hsetAsync(`users:${nickname1}`, 'opponentNickname', nickname2),
            this.db.hsetAsync(`users:${nickname2}`, 'opponentNickname', nickname1),
            this.db.hsetAsync(`users:${nickname1}`, 'gameId', gameId),
            this.db.hsetAsync(`users:${nickname2}`, 'gameId', gameId)
        ]);
        return this.clearGameRequest(nickname1, true);
    }

    async exitGame(nickname){
        try {
            const user = await this.db.hgetallAsync(`users:${nickname}`);
            if (!user) {
                return null;
            }
            const opponentNickname = user.opponentNickname;
            await this.propagateUpdates();
            if (!opponentNickname) {
                return null;
            }
            await this.deleteUserData(nickname,'gameId','opponentNickname','resumeGameAccept');
            await this.db.hsetAsync('users list', nickname, '');
            return this.exitGame(opponentNickname);
        }catch(e){
            console.log(e);
        }
    }

    async gameRequest(initiatorNickname, targetNickname){
        await Promise.all([
            this.db.hsetAsync(`users:${initiatorNickname}`,'sentRequestTo', targetNickname),
            this.db.hsetAsync(`users:${targetNickname}`,'receivedRequestFrom', initiatorNickname),
            this.db.hsetAsync('users list', initiatorNickname, 'sent request'),
            this.db.hsetAsync('users list', targetNickname, 'received request')
        ]);
        return this.propagateUpdates();
    }

    async clearGameRequest(nickname, isRequestConfirmed){
        try {
            const user = await this.db.hgetallAsync(`users:${nickname}`);
            const targetNickname = user.sentRequestTo;
            const initiatorNickname = user.receivedRequestFrom;
            await this.db.hsetAsync('users list', nickname, (isRequestConfirmed ? 'playing' : ''));
            if (targetNickname) {
                await Promise.all([
                    this.db.hdelAsync(`users:${nickname}`, 'sentRequestTo'),
                    this.db.hdelAsync(`users:${targetNickname}`, 'receivedRequestFrom'),
                    this.db.hsetAsync('users list', targetNickname, (isRequestConfirmed ? 'playing' : ''))]);
            }
            if (initiatorNickname) {
                await Promise.all([
                    this.db.hdelAsync(`users:${nickname}`, 'receivedRequestFrom'),
                    this.db.hdelAsync(`users:${initiatorNickname}`, 'sentRequestTo')],
                    this.db.hsetAsync('users list', initiatorNickname, (isRequestConfirmed ? 'playing' : '')));
            }
            return this.propagateUpdates();
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
        return this.db.hgetallAsync(`users:${nickname}`);
    }

    setUserData(nickname,data){
        const promisesArr = [];
        for(let prop in data){
            promisesArr.push(this.db.hsetAsync(`users:${nickname}`, prop, data[prop]))
        }
        return Promise.all(promisesArr);
    }

    deleteUserData(nickname,...userProps){
        return Promise.all(userProps.map(prop =>
            this.db.hdelAsync(`users:${nickname}`,prop)
        ));
    }

    setResumeGameAccept(nickname, value){
        users[nickname].resumeGameAccept = value;
    }

    getResumeGameAccept(nickname){
        return users[nickname].resumeGameAccept;
    }

    async propagateUpdates(){
        try {
            const usersList = await this.db.hgetallAsync('users list');
            this.io.to('authorized_users_room').emit('users list update', usersList);
            //this.io.to('authorized_users_room').emit('debug event');
        }catch(e){
            console.log(e);
        }
    }
}

module.exports = UsersManager;