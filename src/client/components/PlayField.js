import React, {Component} from 'react';
import PropTypes from 'prop-types'
import PlayFieldCell from './PlayFieldCell';

class PlayField extends Component{
    constructor(props){
        super(props)
    }

    render(){
        const {playFieldState,player, ...props} = this.props;
        let playFieldTemplate = [];
        for (let i = 0; i < 3; i++) {
            for (let j = i * 3; j < i * 3 + 3; j++) {
                let playerNum;
                if(player){playerNum = +player.slice(-1)}
                playFieldTemplate.push(
                    <PlayFieldCell
                        cellState={playFieldState[j]}
                        index={j}
                        key={`playfieldcell${j}`}
                        playerNum={playerNum}
                        {...props}
                    />);
            }
            playFieldTemplate.push(<br key={`br${i}`}/>);
        }

        return (
            <div className="play-field">
                {playFieldTemplate}
            </div>
        )
    }
}

PlayField.propTypes ={
    playFieldState: PropTypes.array
};

export default PlayField;