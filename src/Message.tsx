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

        const isOwnMessage = message.from.id === localStorage.getItem('id');

        // Format date - dark magic
        
        const date = new Date(message.sentTimestamp);
        const momentDate = moment(message.sentTimestamp);

        let dayString = momentDate.format('DD/MM/YYYY');
        let timeString = momentDate.format('HH:mm')

        const now = new Date(Date.now());
        if (date.getDate() === now.getDate() &&
            date.getMonth() === now.getMonth() &&
            date.getFullYear() === now.getFullYear()) { // Day is today
                dayString = 'Today'
        }

        const nowYesterday = new Date(new Date().setDate(now.getDate() - 5));
        if (date.getDate() === nowYesterday.getDate() &&
            date.getMonth() === nowYesterday.getMonth() &&
            date.getFullYear() === nowYesterday.getFullYear()) { // Day is yesterday
                dayString = 'Yesterday'
        }

        return (
            <div className={'message ' + (isOwnMessage ? 'me' : '')} key={message.id}>
                <span className='from'>@{message.from.id}</span>
                <span className='text'>{message.text}</span>
                {
                    !(message.status === 'delivered') && isOwnMessage &&
                    <span className="status">Not sent </span>
                }
                <span className='time'>{dayString}, {timeString}</span>
            </div>
        )
    }

}

export default Message;