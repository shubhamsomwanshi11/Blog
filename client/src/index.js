import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Layout from './components/Layout'
import ErrorElement from './pages/ErrorPage'
import Home from './pages/Home'
import PostDetails from './pages/PostDetails'
import Register from './pages/Register'
import Login from './pages/Login'
import UserProfile from './pages/UserProfile'
import CategoryPosts from './pages/CategoryPosts'
import Authors from './pages/Authors'
import AuthorPosts from './pages/AutorPosts'
import CreatePost from './pages/CreatePost'
import EditPost from './pages/EditPost'
import Dashboard from './pages/Dashboard'
import Logout from './pages/Logout'
import DeletePost from './pages/DeletePost'
import UserProvider from './context/userContext';

const router = createBrowserRouter([
  {
    path: '/',
    element: <UserProvider><Layout /></UserProvider>,
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <Home /> },
      { path: 'posts/:id', element: <PostDetails /> },
      { path: 'register', element: <Register /> },
      { path: 'login', element: <Login /> },
      { path: 'profile/:id', element: <UserProfile /> },
      { path: 'authors', element: <Authors /> },
      { path: 'create', element: <CreatePost /> },
      { path: 'posts/:id/edit', element: <EditPost /> },
      { path: 'posts/:id/delete', element: <DeletePost /> },
      { path: 'posts/categories/:category', element: <CategoryPosts /> },
      { path: 'posts/users/:id', element: <AuthorPosts /> },
      { path: 'myposts/:id', element: <Dashboard /> },
      { path: 'logout', element: <Logout /> }
    ]
  }
])
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);