import {SET_NICKNAME_NOTIFICATION, SET_NICKNAME, REJECT_NICKNAME} from '../actions';

const initialState = {
    setNicknameNotification: '',
    nickname: null
};
const login = (state = initialState, action) => {
    switch (action.type) {
        case SET_NICKNAME_NOTIFICATION:
            return {...state, setNicknameNotification: action.notification};

        case SET_NICKNAME:
            return {...state, nickname: action.nickname};

        case REJECT_NICKNAME:
            return {...state, nickname: null};

        default:
            return state;
    }
};

export default  login;