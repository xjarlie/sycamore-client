import React from 'react';
import withOutletContext from './lib/withOutletContext';
import withLoaderData from './lib/withLoaderData';
import { post, serverUrlFrom } from './lib/network';
import Message from './Message';
import { useRouteError } from 'react-router-dom';

class Chat extends React.Component {
    props: any;
    state: any;
    loaded: boolean;

    constructor(props: any) {
        super(props);

        this.state = {
            message: '',
            tempOutbox: []
        }

        this.loaded = false;
        this.onSend = this.onSend.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onKeyDown = this.onKeyDown.bind(this);
    }

    componentDidMount(): void {
        // this.setState({
        //     props: this.props
        // });

        const div = document.querySelector('.messages') as HTMLDivElement;
        div.scrollTo(0, div.scrollHeight);

        const msgInput = document.querySelector('#messageInput') as HTMLElement;
        msgInput.focus();

    }

    async onSend() {
        const text = this.state.message;

        if (text.length === 0) {
            return false;
        }

        if (text.length > 999) {
            alert('Message longer than 999 characters')
        }

        const chatID = {
            id: this.props.loaderData.chatID.split('~')[0],
            url: this.props.loaderData.chatID.split('~')[1]
        }

        const serverURL = localStorage.getItem('serverURL');

        const message = {
            text: text,
            to: {
                id: chatID.id,
                url: serverUrlFrom(chatID.url, true)
            }
        }

        const thisUser = {
            id: localStorage.getItem('id'),
            url: localStorage.getItem('serverURL')
        }

        const tempOutbox = this.state.tempOutbox;
        tempOutbox.push({ 
            ...message, 
            sentTimestamp: Date.now(), 
            from: { 
                id: thisUser.id, 
                url: serverUrlFrom(thisUser.url as string, true) 
            },
            id: 'TEMPORARY-MESSAGE' + Date.now()
        });
        this.setState({
            tempOutbox: tempOutbox
        }, async () => {

            const div = document.querySelector('.messages') as HTMLDivElement;
            div.scrollTo(0, div.scrollHeight);

            const msgInput = document.querySelector('#messageInput') as HTMLInputElement;
            msgInput.value = '';
            msgInput.focus();    


            try {

                const { status, json } = await post(`${serverURL}/outbox`, message);
                console.log(status, json);
                this.setState({
                    message: ''
                });

            } catch (e) {
                alert('Error: ' + e);
                console.log(e);
            }
        });
    }

    onChange(e: any) {

        this.setState({
            message: e.target.value
        });

    }

    onKeyDown(e: any) {
        if (e.code === 'Enter') {
            this.onSend();
        }
    }

    render() {

        const chatID = {
            id: this.props.loaderData.chatID.split('~')[0],
            url: this.props.loaderData.chatID.split('~')[1]
        }

        // Get inbox and sort by chat
        const inbox = this.props.outletContext.inbox;
        const arrInbox: any[] = Object.values(inbox);
        const filteredInbox = arrInbox.filter((message) => {
            return (message.from.id === chatID.id) && (serverUrlFrom(message.from.url, false) === chatID.url)
        });

        // Get outbox and sort by chat
        const outbox = this.props.outletContext.outbox;
        const arrOutbox: any[] = Object.values(outbox);
        const filteredOutbox = arrOutbox.filter((message) => {
            return (message.to.id === chatID.id) && (serverUrlFrom(message.to.url, false) === chatID.url);
        });

        // Combine outbox and inbox, and sort by timestamp
        const messages = filteredInbox.concat(filteredOutbox);
        messages.sort((a, b) => {
            return a.sentTimestamp - b.sentTimestamp
        });


        return (
            <div className='chatPane'>
                <div className='messages'>
                    {
                        messages.map((message) => {
                            return <Message key={message.id} message={message}></Message>
                        })
                    }
                    {
                        this.state.tempOutbox.map((message: any) => {
                            return <Message key={message.id} message={message}></Message>
                        })
                    }
                    <div className='anchor'></div>
                </div>
                <div className='inputWrap'>
                    <input type='text' id='messageInput' placeholder='Send a message...' onChange={this.onChange} onKeyDown={this.onKeyDown} value={this.state.message} ></input>
                    <button type='button' onClick={this.onSend}>Send</button>
                </div>
            </div>
        )
    }
}

function loader({ params }: { params: any }) {
    return { chatID: params.chatID };
}


function ErrorElement() {
    const error: any = useRouteError();

    return (
        <div className='error'>
            <span className='errorTitle'>Sorry, we've run into an issue.</span>
            <span className='errorText'>{error.data}</span>
        </div>
    )

}


export { loader, ErrorElement };
export default withLoaderData(withOutletContext(Chat));