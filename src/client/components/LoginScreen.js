import React, {Component} from 'react';

class LoginScreen extends Component{
    constructor(props){
        super(props)
    }

    onSubmitHandler(e){
        e.preventDefault();
        const nickname = e.target.elements.nickname.value;
        const {setNickname} = this.props;
        setNickname(nickname);
    }

    render(){
        const {setNicknameNotification,clearNotification} = this.props;
        return(
            <div className='start-page'>
                <form onSubmit={this.onSubmitHandler.bind(this)}>
                    <input
                        type='text'
                        name='nickname'
                        onChange={clearNotification}
                        autoFocus
                        placeholder='Enter a nickname'
                        autoComplete='off'
                        maxLength='10'
                        required/>
                    <div className= {'set-name-notifier'}>
                        {setNicknameNotification}
                    </div>
                </form>
            </div>
        );
    }
}



export default LoginScreen;