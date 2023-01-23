import React from 'react';
import { Outlet } from 'react-router-dom';

class Main extends React.Component {
    render() {
        return(
            <div className='main'>
                <div className='sidebar'>
                    <div className='header'>Chats</div>
                    <div className='searchWrap'>
                        <input type="search" />
                    </div>
                    <div className='chatList'></div>
                </div>
                <div className='chatPane'>
                    <Outlet />
                </div>
            </div>
        )
    }
}

export default Main;