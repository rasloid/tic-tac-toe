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
    cellState: PropTypes.number.isRequired,
    index: PropTypes.number.isRequired,
    onClickHandler: PropTypes.func.isRequired
};

export default PlayFieldCell;