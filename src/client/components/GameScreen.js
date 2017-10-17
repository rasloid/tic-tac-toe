import React from 'react';
import PropTypes from 'prop-types'
import Chat from './Chat';
import PlayBox from './PlayBox';

const GameScreen = ({exitGame,...props}) => (
    <div className="game-screen">
        <PlayBox {...props}/>
        <Chat {...props}/>
        <button onClick={()=>exitGame()}>Exit</button>
    </div>
);

GameScreen.propTypes ={
    exitGame: PropTypes.func.isRequired
};

export default GameScreen;