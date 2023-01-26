import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';
import Main, { loader as mainLoader } from './Main';
import Chat, { loader as chatLoader } from './Chat';
import Signup, { loader as signupLoader } from './Signup';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      {
        path: '',
        element: <Navigate to={'chats'} />
      },
      {
        path: 'chats',
        element: <Main />,
        loader: mainLoader,
        children: [
          {
            path: ':chatID',
            element: <Chat />,
            loader: ({params}) => { return chatLoader({params})}
          }
        ]
      },
      {
        path: 'signup',
        element: <Signup />,
        loader: signupLoader
      }
    ]
  }
]);

root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
