import {CHANGE_SCREEN, SHOW_INFO, HIDE_INFO} from '../actions';

const initialState = {
    screen: 'login',
    infoType: 'waiting',
    infoText: 'Connecting'
};

const display = (state = initialState,action) => {
    switch(action.type) {
        case CHANGE_SCREEN:
            return {...state, screen: action.screen};
        case SHOW_INFO:
            return {...state, ...action.data};
        case HIDE_INFO:
            return {...state, infoType: null, infoText: null};
    }
    return state;
};

export default display;


