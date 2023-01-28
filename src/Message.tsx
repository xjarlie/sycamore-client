import React from 'react';
import moment from 'moment';

class Message extends React.Component {
    props: any;
    state: {
        message: any;
    }

    constructor(props: any) {
        super(props);

        this.state = {
            message: props.message
        }
    }

    render() {
        const message = this.state.message;

        const date = moment(message.sentTimestamp);
        const isOwnMessage = message.from.id === localStorage.getItem('id');

        return (
            <div className={'message ' + (isOwnMessage ? 'me' : '')} key={message.id}>
                <span className='from'>@{message.from.id}</span>
                <span className='text'>{message.text}</span>
                {/* <span className='status'>{message.status}</span> */}
                <span className='time'>{}</span>
            </div>
        )
    }

}

export default Message;