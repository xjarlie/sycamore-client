import React from 'react';
import { Outlet } from 'react-router-dom';

class Chats extends React.Component {
    render() {
        return(
            <div className='chats'>
                <h2>Chatsss</h2>
                <Outlet />
            </div>
        )
    }
}

export default Chats;