import React from 'react';
import PropTypes from 'prop-types'
import classNames from 'classnames';

const GameOverScreen = ({player,draw,winner, resumeGameAccept,resumeGameHandler, style}) => {

    let customClass = classNames({
        'game-result':true,
        'green': player === winner,
        'red': !!winner && player !== winner
    });

    return(
        <div className={'game-over-screen'} style={style}>
            <div className={customClass}>
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
        </div>)
};

GameOverScreen.propTypes = {
    player:PropTypes.string,
    draw:PropTypes.bool,
    winner:PropTypes.string,
    resumeGameAccept:PropTypes.bool,
};

export default GameOverScreen;