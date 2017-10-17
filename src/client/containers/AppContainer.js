import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = (state) => ({
     screen: state.screen
});

const AppContainer = connect(
    mapStateToProps
)(App);

export default AppContainer;
