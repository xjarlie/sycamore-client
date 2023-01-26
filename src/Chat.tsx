import React from 'react';
import withOutletContext from './lib/withOutletContext';
import withLoaderData from './lib/withLoaderData';
import { serverUrlFrom } from './lib/network';
import Message from './Message';

class Chat extends React.Component {
    props: any;
    state: any;
    loaded: boolean;

    constructor(props: any) {
        super(props);

        this.state = {

        }

        this.loaded = false;

    }

    componentDidMount(): void {
        // this.setState({
        //     props: this.props
        // });
    }

    render() {
        console.log(this.props);

        const chatID = {
            id: this.props.loaderData.chatID.split('~')[0],
            url: this.props.loaderData.chatID.split('~')[1]
        }

        // Get inbox by chat
        const inbox = this.props.outletContext.inbox;
        const arrInbox: [string, any][] = Object.entries(inbox);
        console.log(arrInbox);
        const filteredInbox = arrInbox.filter(([id, message]) => {

            return (message.from.id === chatID.id) && (serverUrlFrom(message.from.url, false) === chatID.url)
        });
        const objFilteredInbox = Object.fromEntries(filteredInbox);

        return (
            <div className='chatPane'>
                <div className='messages'>
                    {
                        Object.entries(objFilteredInbox).map(([id, message]) => {
                            return <Message key={id} message={message}></Message>
                        })
                    }
                </div>
                <div className='inputWrap'>
                    <input type='text' placeholder='Send a message...'></input>
                    <button type='button'>Send</button>
                </div>
            </div>
        )
    }
}

function loader({ params }: { params: any }) {
    console.log(params);
    return { chatID: params.chatID };
}

export { loader };
export default withLoaderData(withOutletContext(Chat));