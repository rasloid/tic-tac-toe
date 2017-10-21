import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = (state) => ({
    screen: state.display.screen,
    infoType: state.display.infoType,
    infoText: state.display.infoText,
});

const AppContainer = connect(
    mapStateToProps
)(App);

export default AppContainer;
