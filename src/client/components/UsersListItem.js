import React from 'react';
import PropTypes from 'prop-types';

const UsersListItem = ({nickname,isBusy,sendRequest}) => (
    <li>
        <div className='nickname'>{nickname}</div>
        <div className='info'>
            {(isBusy ? 'busy' : '')}
            <a
                className={'a-btn '+(isBusy ? 'hide' : '')}
                onClick={()=>{sendRequest(nickname)}}
            >Send request</a>
        </div>
    </li>);

UsersListItem.propTypes = {
    nickname: PropTypes.string,
    isPlaying: PropTypes.bool,
    sendRequest: PropTypes.func
};

export default UsersListItem;