import React from 'react';
import PropTypes from 'prop-types'

const GameOverScreen = ({player,draw,winner, resumeGameAccept,resumeGameHandler}) => (
    <div className={'game-over-screen block-screen'}>
        <div className={'game-result'}>
            {draw
                ? 'Draw'
                :(player == winner ? 'You win' : 'You lose' )}
        </div>
        <div className="resume-game-control">
            {resumeGameAccept
            ?<div className="spinner"></div>
            :<a
                className='a-btn'
                onClick={resumeGameHandler}
            >Play again</a>
        }
        </div>
    </div>
);

GameOverScreen.propTypes = {
    player:PropTypes.string.isRequired,
    draw:PropTypes.bool,
    winner:PropTypes.string,
    resumeGameAccept:PropTypes.bool,
};

export default GameOverScreen;