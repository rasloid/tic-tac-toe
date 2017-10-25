const Server = require('socket.io');
const adapter = require('socket.io-redis');
const redis = require('redis');
const uuidv4 = require('uuid/v4');

const UsersManager = require('./RedisAPI/UsersManager');
const GamesManager = require('./RedisAPI/GamesManager');
const ServersManager = require('./RedisAPI/ServersManager');


module.exports = (address, port, redisOptions) => {
    const serverName = `${address}:${port}`;
    const io = new Server(port);
    const pub = redis.createClient(redisOptions);
    const sub = redis.createClient(redisOptions);

    let p = new Promise((resolve, reject)=>{
        const pub = redis.createClient(redisOptions);
        const sub = redis.createClient(redisOptions);
        let counter = 0;
        pub.on('ready', ()=>{
            if(++counter === 2){resolve([pub,sub])}
        });
        sub.on('ready', ()=>{
            if(++counter === 2){resolve([pub,sub])}
        });
    });
    p.then(([pub, sub])=>{
        io.adapter(adapter({ pubClient: pub, subClient: sub}));
    }).catch(console.log);

    const users = new UsersManager(redisOptions, serverName);
    const games = new GamesManager(redisOptions);
    const servers = new ServersManager(redisOptions);

    console.log('Game server started');

    let connectedUsersCount = 0;

    io.on('connection', socket => {
        console.log('Connected users ',++connectedUsersCount);
        socket
            .on('new_user_connection', () => {
                console.log('new_user_connection');
                newUserConnection(socket).catch(console.log);
                sub.subscribe(socket.id);
            })
            .on('existing_user_connection', nickname => {
                console.log('existing_user_connection', nickname);
                existingUserConnection(nickname, socket).catch(console.log);
            })
            .on('disconnect', () => {
                console.log('Connected users ',--connectedUsersCount);
            });
    });

    sub.on('message', (channel, msg) => {
        redisMessagesHandler(channel, msg).catch(console.log);
    });

    async function newUserConnection(socket) {
        let userNickname;
        try {
            userNickname = await setNickname(socket);
        } catch (e) {
            socket.emit('set nickname status', false);
            return newUserConnection(socket);
        }
        socket
            .join('authorized_users_room')
            .emit('set nickname status', true)
            .on('disconnect', () => {
                users.removeUser(userNickname);
            });
        return enterPlayGround(userNickname, socket);
    }

    async function existingUserConnection(nickname, socket){
        const userData = await users.getUserData(nickname);
        if (!userData) {
            socket.emit('reconnection_fail');
            return newUserConnection(socket);
        }
        const newSocketId = socket.id;
        sub.subscribe(newSocketId);
        await users.setUserData(nickname, {serverName: serverName, socketId: newSocketId});
        socket
            .join('authorized_users_room')
            .emit('reconnection_success')
            .on('disconnect', () => {
                users.removeUser(nickname).catch(console.log);
            });

        let {gameId, opponentNickname} = userData;
        if (gameId && opponentNickname){
           return restoreGame(userData, socket, 1).catch(console.log);
        }

        await users.clearGameRequest(nickname);
        return enterPlayGround(nickname, socket);
    }

    async function restoreGame(userData, socket, attemptsCount){
        let {nickname, gameId, opponentNickname} = userData;
        let game = await games.getGameData(gameId);
        let playerNum = game.player1 == nickname ? 1 : 2;
        let opponentUserData = await users.getUserData(opponentNickname);
        let aliveServers = await servers.getServers();

        if(aliveServers.indexOf(opponentUserData.serverName) == -1){
            if(attemptsCount > 3){
                await users.removeUser(opponentNickname);
                await endGame(nickname, socket, gameId);
                return enterPlayGround(nickname, socket);
            }
            return setTimeout(()=>{restoreGame(userData, socket, ++attemptsCount).catch(console.log)},2000);
        }

        let opponentSocketId = opponentUserData.socketId;
        let opponentSocket = io.sockets.connected[opponentSocketId];
        socket.emit('game update', game);
        socket.join(gameId);
        if(playerNum === 1){
            await listenToGameEvents(gameId, nickname, opponentNickname, socket);
            if(opponentSocket){
                await Promise.all([
                    endGame(nickname, socket, gameId),
                    endGame(opponentNickname, opponentSocket, gameId)]);
            }else{
                pub.publish(opponentSocketId, JSON.stringify({event: 'exit game'}));
                await endGame(nickname, socket, gameId);
            }
            return enterPlayGround(nickname, socket);
        }

        await listenToGameEvents(gameId, nickname, opponentNickname, socket);
        if(!opponentSocket){
            pub.publish(opponentSocketId, JSON.stringify({event: 'exit game'}));
        }
        await endGame(nickname, socket, gameId);
        return enterPlayGround(nickname, socket);

    }

    async function redisMessagesHandler(channel, msg){
        const data = JSON.parse(msg);
        const socket = io.sockets.connected[channel];
        switch (data.event) {
            case 'game request':
                const status = await listenForReqConfirm(socket, data.initiatorNickname);
                let reply = JSON.stringify({
                    event: 'game request response',
                    status: status,
                    socketId: socket.id,
                    targetNickname: data.targetNickname,
                    initiatorNickname: data.initiatorNickname
                });
                return pub.publish(data.initiatorSocketId, reply);

            case 'game start':
                const nickname = data.targetNickname;
                const roomId = data.gameId;
                await listenToGameEvents(roomId, nickname, data.initiatorNickname, socket);
                pub.publish(data.initiatorSocketId, JSON.stringify({event: 'exit game'}));
                return endGame(nickname, socket, roomId);

            case 'game request response':
                const opponentNickname = data.targetNickname;
                const userNickname = data.initiatorNickname;
                if (data.status) {
                    const opponentSocketId = data.socketId;
                    return gameWithSeparateServerUser(userNickname, opponentNickname, socket, opponentSocketId);
                }
                await users.clearGameRequest(userNickname);
                socket.emit('game_request_reject');
                return enterPlayGround(userNickname, socket);
        }
    }

    async function gameWithSeparateServerUser(userNickname, opponentNickname, socket, opponentSocketId){
        const roomId = await startGame(userNickname, opponentNickname, socket, opponentSocketId, true);
        pub.publish(opponentSocketId, JSON.stringify({event: 'exit game'}));
        await  endGame(userNickname, socket, roomId);
        return enterPlayGround(userNickname, socket);
    }

    async function enterPlayGround(userNickname, socket) {
        let opponentNickname;
        try {
            opponentNickname = await getOpponent(socket);
        } catch (e) {
            console.log(e);
            return enterPlayGround(userNickname, socket);
        }

        console.log(`${userNickname} has sent game request to ${opponentNickname}`);

        await users.gameRequest(userNickname, opponentNickname);

        const opponentUserData = await users.getUserData(opponentNickname);
        const opponentSocketId = opponentUserData.socketId;
        const opponentSocket = io.sockets.connected[opponentUserData.socketId];
        if (!opponentSocket) {
            let msg = JSON.stringify({
                event: 'game request',
                initiatorNickname: userNickname,
                targetNickname: opponentNickname,
                initiatorSocketId: socket.id
            });
            return pub.publish(opponentSocketId, msg);
        }
        const status = await listenForReqConfirm(opponentSocket, userNickname);
        if (!status) {
            socket.emit('game_request_reject');
            await users.clearGameRequest(userNickname);
            return enterPlayGround(userNickname, socket);
        }
        const roomId = await startGame(userNickname, opponentNickname, socket, opponentSocket);
        await Promise.all([
            endGame(userNickname, socket, roomId),
            endGame(opponentNickname, opponentSocket, roomId)]);

        return enterPlayGround(userNickname, socket);
    }

    async function startGame(userNickname, opponentNickname, socket, opponentSocketValue, separateServers) {
        const gameId = uuidv4();
        const roomId = gameId;
        const game = await games.createGame(userNickname, opponentNickname, gameId);
        let listenToGameEndPromise;
        let opponentSocket;

        await users.joinGame(userNickname, opponentNickname, gameId);
        socket.join(roomId);

        if (separateServers) {
            const status = await remoteJoinRoom(opponentSocketValue, roomId);
            if (!status) {
                return roomId;
            }
            const data = {
                event: 'game start',
                gameId: gameId,
                initiatorNickname: userNickname,
                targetNickname: opponentNickname,
                initiatorSocketId: socket.id
            };
            const msg = JSON.stringify(data);
            pub.publish(opponentSocketValue, msg);
            opponentSocket = io.to(opponentSocketValue);
            listenToGameEndPromise = listenToGameEvents(roomId, userNickname, opponentNickname, socket);
        } else {
            opponentSocket = opponentSocketValue;
            opponentSocket.join(roomId);
            listenToGameEndPromise = listenToGameEvents(roomId, userNickname, opponentNickname, socket, opponentSocket);
        }

        socket.emit('game start', {player: 'player1', opponentNickname: opponentNickname, ...game});
        opponentSocket.emit('game start', {player: 'player2', opponentNickname: userNickname, ...game});

        return listenToGameEndPromise;
    }

    async function endGame(userNickname, socket, roomId) {
        try {
            await users.exitGame(userNickname);
            ['game request response',
                'game update',
                'resume game',
                'exit game',
                'new chat message']
                .forEach(event => socket.removeAllListeners(event));

            socket.leave(roomId);
            games.deleteGame(roomId);
        }catch(e){
            console.log(e);
        }
    }

    function listenToGameEvents(roomId, userNickname, opponentNickname, ...sockets){
        return new Promise((res, rej) => {
            sockets.forEach((socket, i) => {
                socket
                    .on('exit game', (nickname) => {
                        socket.to(roomId).emit('exit game', `${nickname} has left the game`);
                        res(roomId);
                    })
                    .on('disconnect', () => {
                        socket.to(roomId).emit('exit game', 'Your opponent has been disconnected');
                        res(roomId);
                    })
                    .on('new chat message', message => {
                        socket.to(roomId).emit('new chat message', message);
                    })
                    .on('game update', async function (data) {
                        let game;
                        try {
                            game = await games.nextTurn(roomId, data);
                        } catch (e) {
                            console.log(e);
                        }
                        io.to(roomId).emit('game update', game);
                    })
                    .on('resume game', async function () {
                        const currentUserNickname = i === 0 ? userNickname : opponentNickname;
                        await users.setUserData(currentUserNickname, {resumeGameAccept: 'accept'});
                        tryToResumeGame(userNickname, opponentNickname, roomId).catch(console.log);
                    });
            });
            sub.once('message', (channel, msg) => {
                const data = JSON.parse(msg);
                if (channel == sockets[0].id && data.event == 'exit game') {
                    res(roomId);
                }
            })
        })
    }


    async function tryToResumeGame(userNickname, opponentNickname, roomId) {
        const userData1 = await users.getUserData(userNickname);
        const userData2 = await users.getUserData(opponentNickname);
        if (userData1.resumeGameAccept && userData2.resumeGameAccept) {
            const game = await games.resumeGame(roomId);
            io.sockets.to(roomId).emit('resume game');
            io.sockets.to(roomId).emit('game update', game);
            users.deleteUserData(userNickname, 'resumeGameAccept');
            users.deleteUserData(opponentNickname, 'resumeGameAccept');
        }
    }

    function getOpponent(socket) {
        return new Promise((res, rej) => {
            socket.once('game request', targetNickname => {
                users.isBusy(targetNickname)
                    .then(reply => {
                        if (reply) {
                            rej(`${targetNickname} is busy now`)
                        }
                        res(targetNickname);
                    })
                    .catch(console.log);
            })
        })
    }

    function listenForReqConfirm(socket, initiatorNickname) {
        return new Promise((res, rej) => {
            const timer = setTimeout(()=>{
                socket.emit('request_expired');
                res(false);
            },20000);
            socket.once('game request response', status => {
                clearTimeout(timer);
                res(status);
            });
            socket.emit('game request', initiatorNickname);
        })
    }

    function setNickname(socket) {
        return new Promise((res, rej) => {
            socket.once('set nickname', nickname => {
                users.addUser(nickname, socket.id)
                    .then(user => {
                        if (!user) {
                            rej(`Nickname "${nickname}" is not available`);
                        }
                        res(user);
                    })
                    .catch(console.log);

            })
        })
    }

    function remoteJoinRoom(socketId, roomId) {
        return new Promise((res, rej) => {
            io.of('/').adapter.remoteJoin(socketId, roomId, err => {
                if (err) {
                    res(false);
                }
                res(true);

            });
        });
    }

};

