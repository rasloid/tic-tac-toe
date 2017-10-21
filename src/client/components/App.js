import React from 'react';
import PropTypes from 'prop-types';
import LoginContainer from '../containers/LoginContainer';
import LobbyContainer from '../containers/LobbyContainer';
import GameContainer from '../containers/GameContainer';
import InfoScreen from '../components/InfoScreen';

const App = ({screen,...props}) => {

    switch(screen){
        case 'login':
            return (
                <div>
                    <InfoScreen {...props}/>
                    <LoginContainer/>
                </div>);
        case 'lobby':
            return (
                <div>
                    <InfoScreen {...props}/>
                    <LobbyContainer/>
                </div>);
        case 'game':
            return (
                <div>
                    <InfoScreen {...props}/>
                    <GameContainer/>
                </div>);
    }
};

App.propTypes = {
    screen: PropTypes.string.isRequired
};

export default App;