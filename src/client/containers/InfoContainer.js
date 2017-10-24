import { connect } from 'react-redux';
import InfoScreen from '../components/InfoScreen';
import {hideInfo, sendResponse} from '../actions';

const mapStateToProps = (state) => ({
    screen: state.display.screen,
    infoType: state.info.infoType,
    infoText: state.info.infoText,
    //receivedRequestFrom: state.lobby.receivedRequestFrom
});

const mapDispatchToProps = dispatch =>({
    onClickHandler: ()=>dispatch(hideInfo()),
    sendResponse: response => {
        dispatch(hideInfo());
        dispatch(sendResponse(response));
    }
});

const InfoContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(InfoScreen);

export default InfoContainer;
