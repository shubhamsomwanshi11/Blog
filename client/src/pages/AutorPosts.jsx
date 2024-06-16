import React, { useEffect, useState } from 'react'
import PostItem from '../components/PostItem'
import Loader from '../components/Loader'
import { useParams } from 'react-router-dom';
import axios from 'axios';
const AutorPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const { id } = useParams();

  useEffect(() => {
    setIsLoading(true);
    setPosts([]); // Clear previous posts
    const getPosts = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/posts/users/${id}`);
        console.log(`${process.env.REACT_APP_BASE_URL}api/users/${id}`);
        if (response)
          setPosts(response.data)
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred');
      }
      setIsLoading(false);
    }
    getPosts();
  }, [id])

  if (isLoading)
    return <Loader />
  return (
    <section className='posts'>
      {error && <p className='error'>{error}</p>}
      <div className="container posts_container">
        {posts && posts.length > 0 ? (
          posts.map((post) => (
            <PostItem
              key={post._id}
              id={post._id}
              category={post.category}
              thumbnail={post.thumbnail}
              title={post.title}
              authorID={post.creator}
              createdAt={post.createdAt}
            />
          ))
        ) : (
          <h2 className='center'>No posts found.</h2>
        )}
      </div>
    </section>
  )
}

export default AutorPosts