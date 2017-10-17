import {RECEIVE_REQUEST, USERS_LIST_UPDATE, SEND_REQUEST, SEND_RESPONSE} from '../actions';

const initialState = {
    users:{},
    receivedRequestFrom: null,
    sendRequestTo: null
};

const lobby = (state = initialState, action) => {
    switch(action.type){
        case USERS_LIST_UPDATE:
            return {
                ...state,
                users:action.users
            };

        case RECEIVE_REQUEST:
            return {
                ...state,
                receivedRequestFrom: action.opponent
            };

        case SEND_REQUEST:
            return {
                ...state,
                sendRequestTo: action.opponent
            };
        case SEND_RESPONSE:
            return{
                ...state,
                receivedRequestFrom: null,
            };

        default:
            return state;
    }
};

export default lobby;