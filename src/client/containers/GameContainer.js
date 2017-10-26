import { connect } from 'react-redux'
import {endGame, resumeGameAccept, playFieldUpdate, sendMessage, changeScreen} from '../actions'
import Game from '../components/Game';

const mapStateToProps = (state) => ({
    screen: state.display.screen,
    ownNickname:state.login.nickname,
    player: state.game.player,
    turn: state.game.turn,
    opponentNickname: state.game.opponentNickname,
    playFieldState: state.game.playFieldState,
    draw: state.game.draw,
    winner: state.game.winner,
    resumeGameAccept: state.game.resumeGameAccept,
    messages: state.game.chat
});

const mapDispatchToProps = (dispatch) => ({
    exitGame:() => {
        dispatch(changeScreen('lobby'));
        setTimeout(() => dispatch(endGame()),2000);
    },
    onClickHandler:(index,playerNum) => {
        dispatch(playFieldUpdate(index, playerNum));
    },
    resumeGameHandler:() => {
        dispatch(resumeGameAccept());
    },
    sendNewMessage:(message) => {
        dispatch(sendMessage(message));
    }
});

const GameContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Game);

export default GameContainer;