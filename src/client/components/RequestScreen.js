import React from 'react';
import PropTypes from 'prop-types';

const RequestScreen = ({haveReceivedRequestFrom,sendResponse}) => (
    <div className={'request-screen'}>
        <span>{haveReceivedRequestFrom} has sent you request</span>
        <a className='green a-btn' onClick={()=>{sendResponse(true)}}>Confirm</a>
        <a className='red a-btn' onClick={()=>{sendResponse(false)}}>Reject</a>
    </div>
);

RequestScreen.propTypes = {
    haveReceivedRequestFrom: PropTypes.string.isRequired,
    sendResponse: PropTypes.func.isRequired
};

export default RequestScreen;