import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppReducer from './reducers';
import AppContainer from './containers/AppContainer';
import socketApi, {socketApiMiddleware} from './socketApi';
//import './styles/bootstrap/css/bootstrap.min.css';
import './styles/style.less';


const store = createStore(
    AppReducer,
    applyMiddleware(socketApiMiddleware)
);

socketApi(store);

render(
    <Provider store={store}>
        <AppContainer/>
    </Provider>,
    document.getElementById('root')
);