import React, {Component} from 'react';
import PropTypes from 'prop-types';
import ReactDOM from 'react-dom';
import ChatMessage from '../Components/ChatMessage';
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
    }

    onSubmitHandler(e){
        e.preventDefault();
        const form = ReactDOM.findDOMNode(this.form);
        const textInput = form.elements.text;
        const text = textInput.value;
        if(!text){
            return;
        }
        const message = {
            author:this.props.ownNickname,
            text: text
        };
        const {sendNewMessage} = this.props;
        sendNewMessage(message);
        textInput.value ='';
        textInput.focus();
    }


    render(){
        const {messages} = this.props;
        const messagesTemplate = [];
        for(let i = 0; i < messages.length; i++){
            let author = messages[i].author;
            if(i  > 0 && messages[i].author == messages[i-1].author){
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
                <form
                    onSubmit={this.onSubmitHandler.bind(this)}
                    ref={(el) => { this.form = el}}>
                    <textarea
                        name='text'
                        required
                        placeholder='Type a message'
                        onKeyDown={e=>{if(e.key=='Enter'){this.onSubmitHandler(e)}}}
                    />
                    <a
                        className='a-btn'
                        onClick={this.onSubmitHandler.bind(this)}
                    >Send</a>
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





















