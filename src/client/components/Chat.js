import React, {Component, PropTypes} from 'react';
import ReactDOM from 'react-dom';
import ChatMessage from '../Components/ChatMessage';
import {newMessageSound} from '../toneApi';
import uuidv4 from 'uuid/v4';

class Chat extends  Component{

    constructor(props){
        super(props);
    }

    scrollToBottom(){
        const node = ReactDOM.findDOMNode(this.messagesEnd);
        node.scrollIntoView();
    }

    componentDidUpdate() {
        this.scrollToBottom();
        const {messages, ownNickname} = this.props;
        if (messages.length && messages[-1].author != ownNickname) {
            newMessageSound();
        }
    }

    onSubmitHandler(e){
        e.preventDefault();
        const textInput = e.target.elements.text;
        const message = {
            author:this.props.ownNickname,
            text: textInput.value
        };
        const {sendNewMessage} = this.props;
        sendNewMessage(message);
        textInput.value ='';
        textInput.focus();
    }


    render(){
        const {messages, ownNickname} = this.props;
        const messagesTemplate = [];
        for(let i = 0; i < messages.length; i++){
            let author = messages[i].author;
            if(i  > 0 && ownNickname == messages[i-1].author){
                author ='';
            }
            messagesTemplate.push(
                <ChatMessage
                    author = {author}
                    text = {messages[i].text}
                    key = {uuidv4()}
                />
            );
        }
        return(
            <div className='chat'>
                <div className="messages">
                    {messagesTemplate}
                    <div style={{ float:'left', clear: 'both' }}
                         ref={(el) => { this.messagesEnd = el}}>
                    </div>
                </div>
                <form onSubmit={this.onSubmitHandler.bind(this)}>
                    <input
                        type='text'
                        name='text'
                        required
                        placeholder='Type a message'
                    />
                    <input type='submit' value='Send'/>
                </form>
            </div>
        )
    }
}

Chat.propTypes ={
    messages: PropTypes.array.isRequired,
    ownNickname: PropTypes.string.isRequired,
    sendNewMessage: PropTypes.func.isRequired
};

export default Chat;





















