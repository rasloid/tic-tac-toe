import React from 'react';
import PropTypes from 'prop-types';
import UsersList from './UsersList';
import RequestScreen from './RequestScreen';

const Lobby = ({ownNickname, haveReceivedRequestFrom,...props}) => (
    <div className="lobby">
        <div><h2> You have joined as '{ownNickname}'</h2></div>
        <UsersList ownNickname={ownNickname} {...props}/>
        {haveReceivedRequestFrom  ? <RequestScreen haveReceivedRequestFrom={haveReceivedRequestFrom} {...props}/> : ''}
    </div>
);

Lobby.propTypes ={
    ownNickname: PropTypes.string.isRequired
};

export default Lobby;