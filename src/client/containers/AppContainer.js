import { connect } from 'react-redux';
import App from '../components/App';
import {hideInfo} from '../actions';

const mapStateToProps = (state) => ({
    screen: state.display.screen,
    info: state.display.info,
    infoType: state.display.infoType,
    infoText: state.display.infoText,
});

const mapDispatchToProps = dispatch =>({
    onClickHandler: ()=>dispatch(hideInfo())
});

const AppContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(App);

export default AppContainer;
