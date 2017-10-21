import React from 'react';
import PropTypes from 'prop-types';

const UsersListItem = ({nickname,isBusy,sendRequest}) => (
    <div>
        <div className='nickname'>{nickname}</div>
        <div className='info'>
            {(isBusy ? 'busy' : '')}
            <a
                className={isBusy ? 'hide' : ''}
                onClick={()=>{sendRequest(nickname)}}
            >Send request</a>
        </div>
    </div>);

UsersListItem.propTypes = {
    nickname: PropTypes.string.isRequired,
    isPlaying: PropTypes.bool,
    sendRequest: PropTypes.func.isRequired
};

export default UsersListItem;