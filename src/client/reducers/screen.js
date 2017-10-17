import {CHANGE_SCREEN} from '../actions';

const screen = (state = 'login',action) => {
    if(action.type == CHANGE_SCREEN){
        return action.screen
    }
    return state;
};

export default screen;


