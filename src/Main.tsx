import React from 'react';
import { NavLink, Outlet, useNavigate, useRouteError } from 'react-router-dom';
import { get } from './lib/network';
import withLoaderData from './lib/withLoaderData';

class Main extends React.Component {

    state: {
        inbox: any,
        outbox: any,
        chats: any,
        searchString: string
    }
    loaded: boolean;
    shouldPoll: boolean;
    props: any;

    constructor(props: any) {
        super(props);

        this.state = {
            inbox: props.loaderData.json.inbox,
            outbox: props.loaderData.json.outbox,
            chats: {},
            searchString: ''
        }

        this.loaded = false;
        this.shouldPoll = false;

        this.startPollInbox = this.startPollInbox.bind(this);
    }

    componentDidMount(): void {
        this.shouldPoll = true;
        if (!this.loaded) {
            this.startPollInbox();
            this.startPollOutbox();
        }
        this.loaded = true;
    }

    componentWillUnmount(): void {
        this.shouldPoll = false;
    }

    async startPollInbox(): Promise<void> {

        while (this.shouldPoll === true) {

            try {
                const serverURL = localStorage.getItem('serverURL');
                console.log(serverURL);
                const response = await get(`${serverURL}/pollInbox`);
                console.log(response.json.message.text);

                const inbox = this.state.inbox;
                inbox[response.json.message.id] = response.json.message;
                this.setState({
                    inbox: inbox
                });
            } catch (e) {
                console.log(e);
                // const sleep = async () => {return new Promise(resolve => setTimeout(resolve, 2000))};
                // await sleep();
            }
        }
    }

    async startPollOutbox(): Promise<void> {

        while (this.shouldPoll === true) {

            try {
                const serverURL = localStorage.getItem('serverURL');
                const response = await get(`${serverURL}/pollOutbox`);
                console.log(response.json.message.text);

                const outbox = this.state.outbox;
                outbox[response.json.message.id] = response.json.message;
                this.setState({
                    outbox: outbox
                })
            } catch (e) {
                console.log(e);
            }

        }

    }

    render() {

        const loaderData = this.props.loaderData;

        // const chats = { // TODO: dynamically add chats based on inbox+outbox
        //     'xjarlie~localhost:4000': {
        //         id: 'xjarlie',
        //         url: 'localhost:4000',
        //         displayName: 'Xjarlie',
        //         unread: 2
        //     },
        //     'xjarlie1~localhost:4000': {
        //         id: 'xjarlie1',
        //         url: 'localhost:4000',
        //         displayName: 'Xjarlie 1',
        //         unread: 0
        //     },
        //     'xjarlie~localhost:3001': {
        //         id: 'xjarlie',
        //         url: 'localhost:3001',
        //         displayName: 'XJARLIE',
        //         unread: 0
        //     }
        // }

        const chats = this.state.chats;

        for (const i in loaderData.json.inbox) {

        }

        return (
            <div className='main'>
                <div className='sidebar'>
                    <div className='header'>Chats</div>
                    <div className='searchWrap'>
                        <input type="search" placeholder='Search...' />
                    </div>
                    <div className='chatList'>
                        {
                            Object.entries(chats).map(([id, chat]: [id: string, chat: any]) => {
                                return (
                                    <NavLink to={`${id}`} className={({isActive}) => {
                                        return isActive ? 'chatItem active' : 'chatItem'
                                    }} key={id}>
                                        <span className='id'>@{chat.displayName}</span>
                                        <span className='url'> ~ {chat.url}</span>
                                        <span className='badge'></span>
                                    </NavLink>
                                )
                            })
                        }
                    </div>
                </div>
                <Outlet context={{ inbox: this.state.inbox, outbox: this.state.outbox }} key={Date.now()} />
            </div>
        )
    }
}

function loader() {
    const serverURL = localStorage.getItem('serverURL');
    return get(serverURL + '/messages');
}

function ErrorElement() {
    const error: any = useRouteError();
    const navigate = useNavigate();

    const serverURL = localStorage.getItem('serverURL');

    return (
        <div className='mainError'>
            <span className='title'>We've run into an issue.</span>
            <span className='text'>Sycamore server ({serverURL}) may be unavailable.</span>
            <button type='button'>Reload</button>
            <button type='button' onClick={() => navigate('/logout')}>Log Out</button>
        </div>
    )

}

export { loader, ErrorElement };
export default withLoaderData(Main);