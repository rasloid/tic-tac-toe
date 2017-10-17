import React from 'react';
import PropTypes from 'prop-types';
import LoginScreenContainer from '../containers/LoginScreenContainer';
import LobbyContainer from '../containers/LobbyContainer';
import GameScreenContainer from '../containers/GameScreenContainer';

const App = ({screen}) => {
    switch(screen){
        case 'login':
            return <LoginScreenContainer/>;
        case 'lobby':
            return <LobbyContainer/>;
        case 'game':
            return <GameScreenContainer/>;
    }
};

App.propTypes = {
    screen: PropTypes.string.isRequired
};

export default App;