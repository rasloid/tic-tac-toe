import {connect} from 'react-redux';
import Login from '../components/Login';
import {setNickname, setNicknameNotification} from '../actions';

const mapStateToProps = state => ({
    setNicknameNotification: state.login.setNicknameNotification,
    screen: state.display.screen,
});
const mapDispatchToProps = dispatch => ({
    setNickname: nickname => {dispatch(setNickname(nickname))},
    clearNotification: () => {dispatch(setNicknameNotification(''))}
});

const LoginScreenContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Login);

export default LoginScreenContainer;


