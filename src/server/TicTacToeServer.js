const redis = require('redis');
const io = require('socket.io')(process.argv[2]);
const ioredis = require('socket.io-redis');
io.adapter(ioredis({ host: 'localhost', port: 6379 }));

const pub = redis.createClient();
const sub = redis.createClient();

const uuidv4 = require('uuid/v4');
const users = require('./UsersManager');
const games = require('./GamesManager');

io.on('connection', socket => {
    socket.on('new connection',() => {
        newConnection(socket).catch(console.log);
        sub.subscribe(socket.id);
        console.log(`sub redis client subscribe to ${socket.id}`);
    });
    socket.on('reconnection', nickname => {
        reconnection(nickname,socket).catch(console.log);
    });
});

sub.on('message', (channel,msg) => {
    console.log(`channel - ${channel}`);
    console.dir(JSON.parse(msg));
    FromAnotherServer(channel,msg)
        .catch(console.log);
});

async function newConnection(socket){
    let userNickname;
    try {
        userNickname = await setNickname(socket);
        console.log(`${socket.id} has set nickname - ${userNickname}`)
    }catch(e){
        console.log('Set nickname error', e);
        socket.emit('set nickname status', false);
        return newConnection(socket);
    }
    socket
        .join('authorized_users_room')
        .emit('set nickname status', true)
        .on('disconnect',()=>{
            users.removeUser(userNickname);
        });
    return enterPlayGround(userNickname,socket);
}

async function reconnection(nickname, socket){
    const userData = await users.getUserData(nickname);
    if(!userData){
        socket.emit('reconnection status', false);
        return newConnection(socket);
    }
    const newSocketId = socket.id;
    users.setUserData(nickname,{socketId: newSocketId});
    sub.subscribe(newSocketId);
    if(userData.opponentNickname){}
}

async function FromAnotherServer(channel,msg){
    const data = JSON.parse(msg);
    const socket = io.sockets.connected[channel];
    switch(data.event){
        case 'game request':
           const status = await listenForReqConfirm(socket, data.initiatorNickname);
           let reply = JSON.stringify({
               event:'game request response',
               status: status,
               socketId: socket.id,
               targetNickname: data.targetNickname,
               initiatorNickname: data.initiatorNickname
           });
           pub.publish(data.initiatorSocketId, reply);
           break;

        case 'game start':
            console.log('game start event from sub redis client');
            console.dir(msg);
            const nickname = data.targetNickname;
            const roomId = data.gameId;
            console.log(nickname, socket.id);
            await listenToGameEvents(roomId, nickname, data.initiatorNickname, socket);
            pub.publish(data.initiatorSocketId,JSON.stringify({event:'exit game'}));
            return endGame(nickname, socket, roomId);

        case 'game request response':
            const opponentNickname = data.targetNickname;
            const userNickname = data.initiatorNickname;
            if(data.status){
                const opponentSocketId = data.socketId;
                return gameWithAnotherServer(userNickname,opponentNickname,socket,opponentSocketId);
            }
            console.log(`${opponentNickname} rejected game request from ${userNickname}`);
            await users.clearGameRequest(userNickname);
            return enterPlayGround(userNickname, socket);
    }
}

async function gameWithAnotherServer(userNickname,opponentNickname, socket, opponentSocketId){
    const roomId = await startGame(userNickname,opponentNickname,socket,opponentSocketId, true);
    pub.publish(opponentSocketId,JSON.stringify({event:'exit game'}));
    await  endGame(userNickname,socket,roomId);
    return enterPlayGround(userNickname, socket);
}

async function enterPlayGround(userNickname, socket){
    let opponentNickname;
    try{
        opponentNickname = await getOpponent(socket);
        console.log(`${userNickname} has sent request to ${opponentNickname}`);
    }catch(e){
        console.log(e);
        return enterPlayGround(userNickname,socket);
    }

    await users.gameRequest(userNickname,opponentNickname);

    const opponentUserData = await users.getUserData(opponentNickname);
    //const opponentSocket =  io.to(opponentUserData.socketId);
    const opponentSocketId = opponentUserData.socketId;
    const opponentSocket =  io.sockets.connected[opponentUserData.socketId];
    if(!opponentSocket){
        let msg = JSON.stringify({
            event: 'game request',
            initiatorNickname: userNickname,
            targetNickname: opponentNickname,
            initiatorSocketId: socket.id
        });
        return pub.publish(opponentSocketId,msg);
    }
    const status = await listenForReqConfirm(opponentSocket,userNickname);
    if(!status) {
        console.log(`${opponentNickname} rejected game request from ${userNickname}`);
        await users.clearGameRequest(userNickname);
        return enterPlayGround(userNickname, socket);
    }

    const roomId = await startGame(userNickname,opponentNickname,socket,opponentSocket);

    await Promise.all([
        endGame(userNickname,socket,roomId),
        endGame(opponentNickname,opponentSocket,roomId)]);

    return enterPlayGround(userNickname, socket);
}



async function startGame(userNickname,opponentNickname,socket,opponentSocketV,separateServers) {
    const gameId = uuidv4();
    const roomId = gameId;
    const game = await games.createGame(userNickname,opponentNickname,gameId);
    let listenToGameEndPromise;
    let opponentSocket;

    await users.joinGame(userNickname, opponentNickname, gameId);
    socket.join(roomId);

    if(separateServers){
        const status = await remoteJoinRoom(opponentSocketV,roomId);
        if(!status){return roomId;}
        const data = {
            event: 'game start',
            gameId: gameId,
            initiatorNickname: userNickname,
            targetNickname: opponentNickname,
            initiatorSocketId: socket.id
        };
        const msg = JSON.stringify(data);
        pub.publish(opponentSocketV, msg);
        console.log(`publish to ${opponentSocketV}`);
        console.dir(data);
        opponentSocket = io.to(opponentSocketV);
        listenToGameEndPromise = listenToGameEvents(roomId, userNickname, opponentNickname, socket);
    }else{
        opponentSocket = opponentSocketV;
        opponentSocket.join(roomId);
        listenToGameEndPromise = listenToGameEvents(roomId, userNickname, opponentNickname, socket, opponentSocket);
    }

    socket.emit('game start', {player:'player1',opponentNickname: opponentNickname, ...game});
    opponentSocket.emit('game start', {player:'player2',opponentNickname: userNickname, ...game});

    return listenToGameEndPromise;
}

async function endGame(userNickname,socket,roomId){
    await users.exitGame(userNickname);
    socket.removeAllListeners(
        'game request response',
        'game update',
        'resume game',
        'exit game',
        'new chat message');
    socket.leave(roomId);
    games.deleteGame(roomId);
}

function listenToGameEvents(roomId,userNickname,opponentNickname,...sockets){
    return new Promise((res,rej)=>{
        console.log('listen to game events');
        sockets.forEach((socket,i)=>{
            socket
                .on('exit game', (nickname) => {
                    socket.to(roomId).emit('exit game',`${nickname} left the game`);
                    res(roomId);
                })
                .on('disconnect', () => {
                    socket.to(roomId).emit('exit game','Your opponent has been disconnected');
                    res(roomId);
                })
                .on('new chat message', message => {
                    socket.to(roomId).emit('new chat message',message);
                })
                .on('game update', async function(data){
                    console.log('game update event', data)
                    let game;
                    try {
                        game = await games.nextTurn(roomId,data);
                    }catch(e){
                        console.log(e);
                    }
                    io.to(roomId).emit('game update', game);
                })
                .on('resume game', async function(){
                    const currentUserNickname = i === 0 ? userNickname : opponentNickname;
                    await users.setUserData(currentUserNickname,{resumeGameAccept: 'accept'});
                    tryToResumeGame(userNickname,opponentNickname,roomId).catch(console.log);
                });
        });
        sub.on('message',(channel,msg) =>{
            const data = JSON.parse(msg);
            if(channel == sockets[0].id && data.event == 'exit game'){
                res(roomId);
            }
        })
    })
}




async function tryToResumeGame(userNickname,opponentNickname,roomId) {
    const userData1 = await users.getUserData(userNickname);
    const userData2 = await users.getUserData(opponentNickname);
    if (userData1.resumeGameAccept && userData2.resumeGameAccept){
        const game = await games.resumeGame(roomId);
        io.sockets.to(roomId).emit('resume game');
        io.sockets.to(roomId).emit('game update', game);
        console.log(`resume game between ${userNickname} ans ${opponentNickname}`);
        users.deleteUserData(userNickname,'resumeGameAccept');
        users.deleteUserData(opponentNickname,'resumeGameAccept');
    }
}

function getOpponent(socket){
    return new Promise((res, rej) => {
        socket.on('game request', targetNickname => {
            users.isBusy(targetNickname)
                .then(reply => {
                    if(reply){
                        rej(`${targetNickname} is busy now`)
                    }
                    res(targetNickname);
                })
                .catch(console.log);
        })
    })
}

function listenForReqConfirm(socket, initiatorNickname){
    return new Promise((res,rej)=>{
        socket.on('game request response',status => {
            res(status);
        });
        socket.emit('game request', initiatorNickname);
    })
}

function setNickname(socket){
    return new Promise((res,rej) => {
        socket.once('set nickname', nickname =>{
            users.addUser(nickname, socket.id)
                .then(user => {
                    if(!user){
                        rej(`Nickname "${nickname}" is not available`);
                    }
                    res(user);
                })
                .catch(console.log);

        })
    })
}

function remoteJoinRoom(socketId, roomId){
    return new Promise((res,rej) => {
        io.of('/').adapter.remoteJoin(socketId, roomId, err => {
            if(err){
                res(false);
            }
            res(true);

        });
    });
}

// /===============================================================
function log(title,item){
    console.log(`==============${title}==================`);
    console.dir(item);
    console.log(`==============${title}==================`);

}