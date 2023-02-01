import React from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { get, serverUrlFrom } from './lib/network';
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
    errors: number;

    constructor(props: any) {
        super(props);

        this.state = {
            inbox: props.loaderData.json.inbox || {},
            outbox: props.loaderData.json.outbox || {},
            chats: {},
            searchString: ''
        }

        this.errors = 0;

        this.loaded = false;
        this.shouldPoll = false;

        this.startPollInbox = this.startPollInbox.bind(this);
        this.addChat = this.addChat.bind(this);
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
                this.errors = 0;
                this.setState({
                    inbox: inbox
                });
            } catch (e) {
                console.log(e);
                this.errors++;
                //const sleep = async () => { return new Promise(resolve => setTimeout(resolve, 100)) };
                //await sleep();

                if (this.errors > 10) {
                    alert('Error: ' + e);
                    this.shouldPoll = false;
                }
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
                this.errors++;
                //const sleep = async () => { return new Promise(resolve => setTimeout(resolve, 100)) };
                //await sleep();

                if (this.errors > 10) {
                    alert('Error: ' + e);
                    this.shouldPoll = false;
                }
            }

        }

    }

    addChat(url: string) {
        const chats = this.state.chats;
        chats[url] = {
            id: url.split('~')[0],
            url: url.split('~')[1]
        }
        this.setState({
            chats: chats
        });
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

        const chats: any = this.state.chats;

        const { inbox, outbox } = loaderData.json;

        for (const i in inbox) {
            const from: {
                id: string,
                url: string
            } = inbox[i].from;
            if (chats[`${from.id}~${serverUrlFrom(from.url, false)}`] === undefined) {
                chats[`${from.id}~${serverUrlFrom(from.url, false)}`] = {
                    id: from.id,
                    url: serverUrlFrom(from.url, false)
                }
            }
        }
        for (const i in outbox) {
            const to: {
                id: string,
                url: string
            } = outbox[i].to;
            if (chats[`${to.id}~${serverUrlFrom(to.url, false)}`] === undefined) {
                chats[`${to.id}~${serverUrlFrom(to.url, false)}`] = {
                    id: to.id,
                    url: serverUrlFrom(to.url, false)
                }
            }
        }

        console.log(chats);

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
                                    <NavLink to={`${id}`} className={({ isActive }) => {
                                        return isActive ? 'chatItem active' : 'chatItem'
                                    }} key={id}>
                                        <span className='id'>@{chat.id}</span>
                                        <span className='url'> ~ {chat.url}</span>
                                        <span className='badge'></span>
                                    </NavLink>
                                )
                            })
                        }
                        <NavLink to={'new'} className={({ isActive }) => {
                            return isActive ? 'newChatButton active' : 'newChatButton'
                        }} >+ New Chat</NavLink>
                    </div>
                    <div className='account'>
                        <div className="username">@{localStorage.getItem('id')}</div>
                        <div className="serverURL">{serverUrlFrom(localStorage.getItem('serverURL') as string, false)}</div>
                        <Link to={'/logout'} className="logout">Log Out</Link>
                    </div>
                </div>
                <Outlet context={{ inbox: this.state.inbox, outbox: this.state.outbox, addChat: this.addChat }} key={Date.now()} />
            </div>
        )
    }
}

function loader() {
    const serverURL = localStorage.getItem('serverURL');
    return get(serverURL + '/messages');
}

function ErrorElement() {
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