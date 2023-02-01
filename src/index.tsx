import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Main, { loader as mainLoader, ErrorElement as MainError } from './Main';
import Chat, { loader as chatLoader } from './Chat';
import Signup from './Signup';
import Logout from './Logout';
import Login from './Login';
import NewChat from './NewChat';

const root = ReactDOM.createRoot(
    document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: 'logout',
                element: <Logout />
            },
            {
                path: '',
                element: <Navigate to={'chats'} />
            },
            {
                path: 'chats',
                element: <Main />,
                loader: mainLoader,
                errorElement: <MainError />,
                children: [
                    {
                        path: 'new',
                        element: <NewChat />
                    },
                    {
                        path: ':chatID',
                        element: <Chat />,
                        loader: ({ params }) => { return chatLoader({ params }) }
                    }
                ]
            },
            {
                path: 'signup',
                element: <Signup />
            },
            {
                path: 'login',
                element: <Login />,
            }
        ]
    }
], {
    basename: process.env.PUBLIC_URL
});

root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
