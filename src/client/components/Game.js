import React from 'react';
import PropTypes from 'prop-types'
import Chat from './Chat';
import PlayBox from './PlayBox';

const Game = ({exitGame,...props}) => (
    <div className="game-screen">
        <PlayBox {...props}/>
        <Chat {...props}/>
        <button onClick={()=>exitGame()}>Exit</button>
    </div>
);

Game.propTypes ={
    exitGame: PropTypes.func.isRequired
};

export default Game;