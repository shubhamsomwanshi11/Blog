import React, { useEffect, useState } from 'react'
import PostItem from './PostItem';
import Loader from './Loader';
import axios from 'axios'

const Posts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/posts/`);
        if (response)
          setPosts(response.data)
      } catch (err) {
        console.error(err);
      }

      setIsLoading(false);
    }
    fetchPosts();
  }, [])

  if (isLoading)
    return <Loader />

  return (
    <section className='posts'>
      <div className="container posts_container">
        {posts.length > 0 ? (
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
          <h2 className='center' >No posts found.</h2>
        )}
      </div>
    </section>
  )
}

export default Posts