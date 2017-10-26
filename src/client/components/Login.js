import React, {Component} from 'react';
import { Transition } from 'react-transition-group';
import{duration, defaultStyle, transitionStyles } from '../animation.config';

class Login extends Component{
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
        const {setNicknameNotification,clearNotification,screen} = this.props;

        return(
            <Transition in={screen=='login'} timeout={duration}>
                    {state => (
                    <div className='login' style={{...defaultStyle, ...transitionStyles[state]
                    }}>
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
                     </div>)}
            </Transition>
        );
    }
}



export default Login;