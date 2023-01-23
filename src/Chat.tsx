import React from 'react';
import { get } from './lib/network';
import withLoaderData from './lib/withLoaderData';

class Chat extends React.Component {
    props: any;
    state: {
        messages: any,
        helloWorld: string
    }
    loaded: boolean;

    constructor(props: any) {
        super(props);

        this.state = {
            messages: {},
            helloWorld: 'aaaa'
        }

        this.loaded = false;

        this.startPoll = this.startPoll.bind(this);
    }

    componentDidMount(): void {
        if (!this.loaded) {
            this.startPoll();
        }
        this.loaded = true;
    }

    async startPoll() {

        let status = 0;

        while (status === 0) {
            const serverURL = sessionStorage.getItem('serverURL');
            console.log(serverURL);
            const response = await get(`${serverURL}/pollInbox`);
            console.log(response.json.message.text);

        }


        // repeat infinitely
    }

    render() {
        const helloWorld = this.state.helloWorld;
        console.log(this.props.loaderData);
        return (
            <div className='chat'>
                {helloWorld}
                <br />
                <button type='button' onClick={this.startPoll}>Start Poll</button>
            </div>
        )
    }
}

function loader({ params }: { params: any }) {
    return { chatID: params.chatID };
}

export { loader };
export default withLoaderData(Chat);