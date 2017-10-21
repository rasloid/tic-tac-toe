import { combineReducers } from 'redux'
import game from './game';
import lobby from './lobby';
import login from './login';
import display from './display'

const AppReducer = combineReducers({
    display,
    game,
    lobby,
    login
});

export default AppReducer;