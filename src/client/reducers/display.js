import {CHANGE_SCREEN, SHOW_INFO, HIDE_INFO} from '../actions';

const initialState = {
    screen: 'login',
    info: true,
    infoType: 'waiting',
    infoText: 'Connecting',
    timer: null
};

const display = (state = initialState,action) => {
    switch(action.type) {
        case CHANGE_SCREEN:
            return {...state, screen: action.screen};
        case SHOW_INFO:
            return {...state, info: true, ...action.data};
        case HIDE_INFO:
            return {...state, info: false};
    }
    return state;
};

export default display;

