import {connect} from 'react-redux';
import {sendRequest, sendResponse} from '../actions';
import Lobby from '../components/Lobby';

const mapStateToProps = state => ({
    ownNickname: state.login.nickname,
    haveReceivedRequestFrom: state.lobby.receivedRequestFrom,
    users: state.lobby.users,
    haveSentRequestTo: state.lobby.sentRequestTo
});

const mapDispatchToProps = dispatch => ({
    sendRequest: opponent => {
        dispatch(sendRequest(opponent));
    },
    sendResponse: response => {
        dispatch(sendResponse(response));
    }
});

const LobbyContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Lobby);

export default LobbyContainer;