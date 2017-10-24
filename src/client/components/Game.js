import React from 'react';
import PropTypes from 'prop-types'
import Chat from './Chat';
import PlayBox from './PlayBox';
import { Transition } from 'react-transition-group';
import{duration, defaultStyle, transitionStyles } from '../animation.config';

const Game = ({exitGame,screen,...props}) => (
    <Transition in={screen == 'game'} timeout={duration}>
    {state =>(
        <div className="game-screen" style={{...defaultStyle, ...transitionStyles[state]}}>
            <a className='a-btn' onClick={()=>exitGame()}>Exit</a>
            <PlayBox {...props}/>
            <Chat {...props}/>
        </div>
    )}
    </Transition>
);

Game.propTypes ={
    exitGame: PropTypes.func.isRequired
};

export default Game;