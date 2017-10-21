import io from 'socket.io-client';
import * as actions from './actions';

let socket = null;
let requestCount = 0;

function connectToGameServer(store){
    fetch('/tic-tac-toe')
        .then(response => response.json())
        .then(data => {
            console.log('Game server:',data.host);
            if(!data.host){
                if(requestCount++ > 3){
                    requestCount = 0;
                    return store.dispatch(actions.showInfo({
                        infoType:'503',
                        infoText:'Try to connect later'}));
                }
                return setTimeout(() => connectToGameServer(store),5000);
            }
            socket = io(data.host,{
                autoConnect:false,
                reconnectionAttempts:6,
                reconnectionDelay: 1000
            });
            socket
                .on('connect',()=>{
                    requestCount = 0;
                    let nickname = store.getState().login.nickname;
                    if(nickname){
                        socket.emit('existing_user_connection',nickname);
                    }else {
                        socket.emit('new_user_connection');
                    }
                    store.dispatch(actions.hideInfo());
                    addGameListeners(store);
                })
                .on('disconnect', reason => {
                    console.log(reason);
                    store.dispatch(actions.showInfo({
                        infoType:'waiting',
                        infoText:'Connection lost. Trying to reconnect'}));
                })
                .on('reconnect_failed', () => {
                    return connectToGameServer(store);
                })
                .open();
        })
        .catch((err) => {
            console.log(err);
            store.dispatch(actions.showInfo({
                infoType:'503',
                infoText:'Try to connect later'}));
        });
}


function addGameListeners(store){
    socket
        .on('set nickname status', status =>{
            if(status){
                console.log(' socket set nickname status');
                return store.dispatch(actions.changeScreen('lobby'));
            }
            store.dispatch(actions.rejectNickname());
            store.dispatch(actions.setNicknameNotification('this nickname is not available'));
        })
        .on('users list update', users =>{
            console.log('socket users list update');
            console.dir(users);
            store.dispatch(actions.usersListUpdate(users));
        })
        .on('game request', opponent =>{
            console.log('socket game request');
            store.dispatch(actions.receiveRequest(opponent));
        })
        .on('game start', data =>{
            console.log(' socket game start');
            console.dir(data);
            store.dispatch(actions.hideInfo());
            store.dispatch(actions.startGame(data));
            store.dispatch(actions.changeScreen('game'));
        })
        .on('game update', data => {
            store.dispatch(actions.gameUpdate(data));
            console.log('socket game update');
            console.dir(data);
        })
        .on('exit game', reason => {
            console.log('socket exit game');
            store.dispatch(actions.changeScreen('lobby'));
            store.dispatch(actions.endGame(reason));
        })
        .on('new chat message', message => {
            console.log('socket new chat message');
            store.dispatch(actions.newMessage(message));
        })
        .on('resume game', () => {
            console.log('socket resume game');
            store.dispatch(actions.resumeGame())
        })
        .on('game_request_reject',()=>{
            store.dispatch(actions.hideInfo());
        })
}

export const socketApiMiddleware = (store) => next => action =>{
    const result = next(action);
    if(!socket){
        return result;
    }
    switch(action.type){
        case actions.SET_NICKNAME:
            socket.emit('set nickname', action.nickname);
            break;
        case actions.SEND_REQUEST:
            store.dispatch(actions.showInfo({infoType:'waiting',infoText:'Waiting for game confirm'}));
            setTimeout(()=>{store.dispatch(actions.hideInfo())},20000);
            socket.emit('game request', action.opponent);
            break;
        case actions.SEND_RESPONSE:
            socket.emit('game request response', action.response);
            break;
        case actions.END_GAME:
            socket.emit('exit game');
            break;
        case actions.PLAYFIELD_UPDATE:
            socket.emit('game update', action.data);
            break;
        case actions.NEW_MESSAGE:
            socket.emit('new chat message', action.message);
            break;
        case actions.RESUME_GAME_ACCEPT:
            console.log('resume game accept');
            socket.emit('resume game');
            break;
    }
    return result;
};


export default connectToGameServer;