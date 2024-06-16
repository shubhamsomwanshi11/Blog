import React, { useEffect, useState } from 'react';
import PostItem from '../components/PostItem';
import Loader from '../components/Loader';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const CategoryPosts = () => {
  const [posts, setPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { category } = useParams();

  useEffect(() => {
    const fetchPosts = async () => {
      setIsLoading(true);
      setPosts([]); // Clear previous posts
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/posts/categories/${category}/`);
        if (response) {
          setPosts(response.data);
        }
      } catch (err) {
        console.error(err);
      }
      setIsLoading(false);
    };

    fetchPosts();
  }, [category]); // Add 'category' as a dependency

  if (isLoading) {
    return <Loader />;
  }

  return (
    <section className="posts">
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
          <h2 className="center">No posts found.</h2>
        )}
      </div>
    </section>
  );
};

export default CategoryPosts;
