import React from 'react';
import withOutletContext from './lib/withOutletContext';
import withLoaderData from './lib/withLoaderData';
import { serverUrlFrom } from './lib/network';

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
        this.setState({
            props: this.props
        });
    }

    render() {
        console.log(this.props);
        // Get inbox by chat
        const inbox = this.props.outletContext.inbox;
        const arrInbox: [string, any][] = Object.entries(inbox);
        const filteredInbox = arrInbox.filter(([id, message]) => {

            console.log()

            return (message.from.id === this.state.chatID.id) && (serverUrlFrom(message.from.url, false) === this.state.chatID.url)
        });
        const objFilteredInbox = Object.fromEntries(filteredInbox);

        return (
            <div className='chat'>
                <br />
                {
                    Object.entries(objFilteredInbox).map(([id, message]) => {
                        return <div key={id} className='message'>{id}: {message.text}</div>
                    })
                }
                <button type='button'>{this.props.loaderData.chatID}</button>
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