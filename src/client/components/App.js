import React from 'react';
import LoginContainer from '../containers/LoginContainer';
import LobbyContainer from '../containers/LobbyContainer';
import GameContainer from '../containers/GameContainer';
import InfoContainer from '../containers/InfoContainer';

const App = () => {
    return (
        <div>
            <InfoContainer/>
            <LoginContainer/>
            <LobbyContainer/>
            <GameContainer/>
        </div>);
};
export default App;