import React from 'react';
import PropTypes from 'prop-types';
import UsersList from './UsersList';
import { Transition } from 'react-transition-group';
import{duration, defaultStyle, transitionStyles } from '../animation.config';

const Lobby = ({ownNickname,screen,...props}) => (
    <Transition in={screen == 'lobby'} timeout={duration}>
        {state => (
            <div className='lobby' style={{...defaultStyle, ...transitionStyles[state]}}>
                <div><h2> Login:{ownNickname}</h2></div>
                <UsersList ownNickname={ownNickname} {...props}/>
            </div>
        )}
    </Transition>
);

Lobby.propTypes ={
    ownNickname: PropTypes.string
};

export default Lobby;