import { combineReducers } from 'redux'
import game from './game';
import lobby from './lobby';
import login from './login';
import screen from './screen'

const AppReducer = combineReducers({
    screen,
    game,
    lobby,
    login
});

export default AppReducer;