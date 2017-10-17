import React, {PropTypes} from 'react';

const ChatMessage = ({author,text}) => (
    <div className='message'>
        <div className='author'>
            {author}
        </div>
        <div className='text'>
            {text}
        </div>
    </div>
);

ChatMessage.propTypes ={
    author: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
};

export default ChatMessage;