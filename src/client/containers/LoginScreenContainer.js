import {connect} from 'react-redux';
import LoginScreen from '../components/LoginScreen';
import {setNickname, setNicknameNotification} from '../actions';

const mapStateToProps = state => ({
    setNicknameNotification: state.login.setNicknameNotification
});
const mapDispatchToProps = dispatch => ({
    setNickname: nickname => {dispatch(setNickname(nickname))},
    clearNotification: () => {dispatch(setNicknameNotification(''))}
});

const LoginScreenContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(LoginScreen);

export default LoginScreenContainer;


