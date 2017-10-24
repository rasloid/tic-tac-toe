import React from 'react';
import PropTypes from 'prop-types'

const PlayFieldCell = ({cellState, index,playerNum, onClickHandler}) =>(
    <div
        className={'cell ' + `player${cellState}`}
        onClick={()=>{
            cellState == 0 ? onClickHandler(index,playerNum) : ''}
        }
    >
    </div>
);

PlayFieldCell.propTypes = {
    cellState: PropTypes.number,
    index: PropTypes.number,
    onClickHandler: PropTypes.func
};

export default PlayFieldCell;