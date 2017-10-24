import {SHOW_INFO, HIDE_INFO, RECEIVE_REQUEST} from '../actions';

const initialState = {
    infoType: 'waiting',
    infoText: 'Connecting'
};

const display = (state = initialState,action) => {
    switch(action.type) {
        case SHOW_INFO:
            return {...state, ...action.data};
        case HIDE_INFO:
            return {...state};
        case RECEIVE_REQUEST:
            return {infoType: 'request', infoText: `${action.opponent} want to play with you`};
    }
    return state;
};

export default display;

