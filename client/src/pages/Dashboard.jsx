import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userContext } from '../context/userContext';
import axios from 'axios';
import Loader from '../components/Loader';
import DeletePost from './DeletePost';

const Dashboard = () => {
  const { currentUser } = useContext(userContext);
  const [posts, setPosts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const token = currentUser?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/posts/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response) setPosts(response.data);
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };
    fetchPosts();
  }, [token, navigate]);

  const handlePostDelete = (id) => {
    setPosts((prevPosts) => prevPosts.filter(post => post._id !== id));
  };

  if (isLoading) return <Loader />;
  return (
    <section className="dashboard">
      {posts && posts.length ? (
        <div className="container dashboard-container">
          {posts.map(post => (
            <article key={post._id} className="dashboard-post">
              <div className='dashboard-post-thumbnail'>
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}`} alt="" />
              </div>
              <div className='dashboard-post-action'>
                <h5>{post.title}</h5>
              </div>
              <div className="dashboard-post-action">
                <Link className='btn sm' to={`/posts/${post._id}`}>View</Link>
                <Link className='btn sm primary' to={`/posts/${post._id}/edit`}>Edit</Link>
                <DeletePost id={post._id} onDelete={handlePostDelete} />
              </div>
            </article>
          ))}
        </div>
      ) : (
        <h2 className="center">You have no posts yet.</h2>
      )}
    </section>
  );
};

export default Dashboard;
