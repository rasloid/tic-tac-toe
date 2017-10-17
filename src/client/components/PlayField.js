import React, {Component} from 'react';
import PropTypes from 'prop-types'
import PlayFieldCell from './PlayFieldCell';
import  uuidv4 from 'uuid/v4';

class PlayField extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const {playFieldState,player, ...props} = this.props;
        let playFieldTemplate = [];
        for (let i = 0; i < 3; i++) {
            for (let j = i * 3; j < i * 3 + 3; j++) {
                const playerNum = +player.slice(-1);
                playFieldTemplate.push(
                    <PlayFieldCell
                        cellState={playFieldState[j]}
                        index={j}
                        key={uuidv4()}
                        playerNum={playerNum}
                        {...props}
                    />);
            }
            playFieldTemplate.push(<br key={uuidv4()}/>);
        }

        return (
            <div className="play-field">
                {playFieldTemplate}
            </div>
        )
    }
}

PlayField.propTypes ={
    playFieldState: PropTypes.array.isRequired
};

export default PlayField;