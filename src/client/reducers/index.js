import { combineReducers } from 'redux'
import game from './game';
import lobby from './lobby';
import login from './login';
import display from './display'
import info from './info';

const AppReducer = combineReducers({
    display,
    game,
    lobby,
    login,
    info
});

export default AppReducer;