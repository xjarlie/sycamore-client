import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { get } from './lib/network';

class Main extends React.Component {

    state: {
        messages: any
    }
    loaded: boolean;
    shouldPoll: boolean;

    constructor(props: any) {
        super(props);

        this.state = {
            messages: {

            }
        }

        this.loaded = false;
        this.shouldPoll = false;

        this.startPoll = this.startPoll.bind(this);
    }

    componentDidMount(): void {
        this.shouldPoll = true;
        if (!this.loaded) {
            this.startPoll();
        }
        this.loaded = true;
    }

    componentWillUnmount(): void {
        this.shouldPoll = false;
    }

    async startPoll(): Promise<void> {

        while (this.shouldPoll === true) {

            try {
                const serverURL = localStorage.getItem('serverURL');
                console.log(serverURL);
                const response = await get(`${serverURL}/pollInbox`);
                console.log(response.json.message.text);

                const messages = this.state.messages;
                messages[response.json.message.id] = response.json.message;
                this.setState({
                    messages: messages
                });
            } catch (e) {
                console.log(e);
                const sleep = async () => {return new Promise(resolve => setTimeout(resolve, 2000))};
                await sleep();
            }

        }
    }

    render() {

        const chats = {
            'xjarlie~localhost:4000': {
                id: 'xjarlie',
                url: 'localhost:4000',
                displayName: 'Xjarlie',
                unread: 2
            },
            'xjarlie1~localhost:4000': {
                id: 'xjarlie1',
                url: 'localhost:4000',
                displayName: 'Xjarlie 1',
                unread: 0
            },
            'xjarlie~localhost:3001': {
                id: 'xjarlie',
                url: 'localhost:3001',
                displayName: 'XJARLIE',
                unread: 0
            }
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
                            Object.entries(chats).map(([id, chat]) => {
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
                <div className='chatPane'>
                    <Outlet context={{ inbox: this.state.messages }} key={Date.now()} />
                </div>
            </div>
        )
    }
}

export default Main;