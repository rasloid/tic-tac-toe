import {
    START_GAME,
    END_GAME,
    GAME_UPDATE,
    RESUME_GAME_ACCEPT,
    PLAYFIELD_UPDATE,
    RESUME_GAME,
    RECEIVE_MESSAGE,
    SEND_MESSAGE
} from '../actions';

const getChatState = (state=[],action) => {
    if(action){
        return [...state, action.message];
    }
    return state;
};
const getPlayFieldState = (state=[0,0,0,0,0,0,0,0,0],action) =>
    state.map((cell,index) => {
      if(action && index == action.data.index){
        return action.data.playerNum;
      }
      return cell;
    });

const initialState = {
    player: null,
    opponentNickname: null,
    turn: null,
    winner: null,
    draw: false,
    playFieldState: getPlayFieldState(),
    chat: getChatState(),
    resumeGameAccept: false
};

const game = (state=initialState, action) => {
      switch(action.type){
          case START_GAME:
              return {
                  ...state,
                  ...action.data
              };

          case END_GAME:
              return initialState;

          case GAME_UPDATE:
              return {
                  ...state,
                  ...action.data
              };

          case PLAYFIELD_UPDATE:
              return {
                  ...state,
                  playFieldState: getPlayFieldState(state.playFieldState, action),
                  turn: 'not your turn'
              };

          case  RESUME_GAME_ACCEPT:
              return {
                  ...state,
                  resumeGameAccept: true
              };

          case RECEIVE_MESSAGE:
              return {
                  ...state,
                  chat: getChatState(state.chat, action)
              };

          case SEND_MESSAGE:
              return {
                  ...state,
                  chat: getChatState(state.chat, action)
              };


          case RESUME_GAME:
                return {
                    ...state,
                    resumeGameAccept: false
                };

          default:
              return state;
      }
};

export default game;