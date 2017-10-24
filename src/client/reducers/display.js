import {CHANGE_SCREEN, SHOW_INFO, HIDE_INFO, RECEIVE_REQUEST} from '../actions';

const initialState = {
    screen: 'info',
    prevScreen: 'login'
};

const display = (state = initialState,action) => {
    switch(action.type) {
        case CHANGE_SCREEN:
            return {screen: action.screen, prevScreen: state.screen};
        case SHOW_INFO:
            return {screen:'info', prevScreen: action.data.nextScreen || (state.screen == 'info' ? state.prevScreen : state.screen)};
        case HIDE_INFO:
            return {...state, screen: state.prevScreen};
        case RECEIVE_REQUEST:
            return {screen:'info', prevScreen: (state.screen == 'info' ? state.prevScreen : state.screen)};
    }
    return state;
};

export default display;

