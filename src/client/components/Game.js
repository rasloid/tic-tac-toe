import React from 'react';
import PropTypes from 'prop-types'
import Chat from './Chat';
import PlayBox from './PlayBox';

const Game = ({exitGame,...props}) => (
    <div className="game-screen">
        <PlayBox {...props}/>
        <Chat {...props}/>
        <a className='a-btn' onClick={()=>exitGame()}>Exit</a>
    </div>
);

Game.propTypes ={
    exitGame: PropTypes.func.isRequired
};

export default Game;