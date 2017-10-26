import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import AppReducer from './reducers';
import App from './components/App';
import socketApi, {socketApiMiddleware} from './socketApi';
import './styles/index.pcss';


const store = createStore(
    AppReducer,
    applyMiddleware(socketApiMiddleware)
);

socketApi(store);

render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById('root')
);