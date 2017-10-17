import React from 'react';
import PropTypes from 'prop-types'
import PlayField from './PlayField';
import GameOverScreen from './GameOverScreen';

const PlayBox = ({player,turn,opponentNickname,draw,winner,...props}) => (
    <div className="play-box">
        <PlayField player={player}{...props}/>
        <div className='player-turn-status'>
            {draw || winner
             ? ''
             :('Now is ' + (player == turn ? 'your' : opponentNickname) + ' turn')}
        </div>
        <div
            className={'block-screen ' + (player == turn ? 'hide' : '')}
        ></div>
        {draw || winner
            ? <GameOverScreen draw={draw} winner={winner} player={player} {...props}/>
            : ''
        }
    </div>
);

PlayBox.propTypes = {
    player: PropTypes.string.isRequired,
    turn: PropTypes.string.isRequired,
    opponentNickname: PropTypes.string.isRequired,
    draw: PropTypes.bool,
    winner: PropTypes.string
};

export default PlayBox;