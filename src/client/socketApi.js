import io from 'socket.io-client';
import * as actions from './actions';

let userId = null;
let socket = null;

export default store => {
    fetch('/tic-tac-toe')
        .then(response =>
            response.json())
        .then(data => {
            userId = data.userId;
            socket = io.connect(data.host);
            socket.on('debug event', ()=>{console.log('DEBUG EVENT')});
            socketApi(store);
            socket.emit('new connection');
            console.log(userId);
            console.log(data.host);
        })
        .catch(console.log);
};

function socketApi(store){
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
            store.dispatch(actions.usersListUpdate(users));
        })
        .on('game request', opponent =>{
            console.log('socket game request');
            store.dispatch(actions.receiveRequest(opponent));
        })
        .on('game start', data =>{
            console.log(' socket game start');
            console.dir(data);
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
}

export const socketApiMiddleware = (/*store*/) => next => action =>{
    const result = next(action);

    if(!socket){
        return result;
    }

    switch(action.type){

        case actions.SET_NICKNAME:
            socket.emit('set nickname', action.nickname);
            break;

        case actions.SEND_REQUEST:
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
