import React from 'react';
import PropTypes from 'prop-types'
import { Transition } from 'react-transition-group';

const duration = 100;
const defaultStyle = {
    transition: `opacity ${duration}ms ease-out, transform ${duration}ms ease-out`,
    opacity: 0
};
const transitionStyles = {
    entering: { opacity: 0, transform: 'scale(1.5)'},
    entered: { opacity: 1, transform: 'scale(1)'},
    exiting: { opacity: 1, transform: 'scale(1)' },
    exited: { opacity: 0, transform: 'scale(0.7)'}
};

const PlayFieldCell = ({cellState, index,playerNum, onClickHandler}) =>(
    <div
        className={'cell ' + `player${cellState}`}
        onClick={()=>{
            cellState == 0 ? onClickHandler(index,playerNum) : ''}
        }
    >
        <Transition in={cellState} timeout={duration}>
            {state => (
                <div className='mark' style={{...defaultStyle, ...transitionStyles[state]}}>
                </div>
            )}
        </Transition>
    </div>
);

PlayFieldCell.propTypes = {
    cellState: PropTypes.number,
    index: PropTypes.number,
    onClickHandler: PropTypes.func
};

export default PlayFieldCell;