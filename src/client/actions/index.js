export const END_GAME = 'END_GAME',
             START_GAME = 'START_GAME',
             RESUME_GAME_ACCEPT = 'RESUME_GAME_ACCEPT',
             GAME_UPDATE = 'GAME_UPDATE',
             NEW_MESSAGE = 'NEW_MESSAGE',
             SET_NICKNAME = 'SET_NICKNAME',
             SET_NICKNAME_NOTIFICATION = 'SET_NICKNAME_NOTIFICATION',
             SEND_REQUEST = 'SEND_REQUEST',
             RECEIVE_REQUEST = 'RECEIVE_REQUEST',
             SEND_RESPONSE = 'SEND_RESPONSE',
             RECEIVE_RESPONSE = 'RECEIVE_RESPONSE',
             USERS_LIST_UPDATE = 'USERS_LIST_UPDATE',
             CHANGE_SCREEN = 'CHANGE_SCREEN',
             PLAYFIELD_UPDATE = 'PLAYFIELD_UPDATE',
             RESUME_GAME = 'RESUME_GAME',
             REJECT_NICKNAME = 'REJECT_NICKNAME',
             SHOW_INFO = 'SHOW_INFO',
             HIDE_INFO = 'HIDE_INFO',
             SEND_MESSAGE = 'SEND_MESSAGE',
             RECEIVE_MESSAGE = 'RECEIVE_MESSAGE',
             REQUEST_EXPIRED = 'REQUEST_EXPIRED';


export const endGame = () =>({
   type: END_GAME
});

export const startGame = (data) =>({
    type: START_GAME,
    data
});

export const showInfo = (data) => ({
    type: SHOW_INFO,
    data
});

export const hideInfo = () => ({
    type: HIDE_INFO
});

export const resumeGame = () => ({
    type: RESUME_GAME
});

export const resumeGameAccept  = () =>({
    type: RESUME_GAME_ACCEPT
});

export const gameUpdate = (data) =>({
    type: GAME_UPDATE,
    data
});

export const playFieldUpdate = (index,playerNum)=>({
    type: PLAYFIELD_UPDATE,
    data:{index,playerNum}
});

export const sendMessage = (message) =>({
    type: SEND_MESSAGE,
    message
});

export const receiveMessage = (message) =>({
    type: RECEIVE_MESSAGE,
    message
});

export const setNickname  = (nickname) =>({
    type: SET_NICKNAME,
    nickname
});

export const rejectNickname = () =>({
    type: REJECT_NICKNAME
});

export const setNicknameNotification = notification => ({
    type: SET_NICKNAME_NOTIFICATION,
    notification
});

export const sendRequest = (opponent) =>({
    type: SEND_REQUEST,
    opponent
});

export const receiveRequest  = (opponent) =>({
    type: RECEIVE_REQUEST,
    opponent
});

export const expireRequest  = () =>({
    type: REQUEST_EXPIRED
});

export const sendResponse = (response) =>({
    type: SEND_RESPONSE,
    response
});

export const receiveResponse = (response) =>({
    type: RECEIVE_RESPONSE,
    response
});

export const usersListUpdate = (users) =>({
    type: USERS_LIST_UPDATE,
    users
});

export const changeScreen = (screen) => ({
    type: CHANGE_SCREEN,
    screen
});















