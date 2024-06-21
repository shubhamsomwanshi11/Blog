import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Avatar from '../images/avatar1.jpg'
import { formatDistanceToNow } from 'date-fns';



const PostAuthor = ({ authorID, createdAt }) => {
  const [author, setAuthor] = useState([]);
  useEffect(() => {
    const getAuthor = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/users/${authorID}`);
        if (response)
          setAuthor(response.data)
      } catch (error) {
        console.log(error);
      }
    }
    getAuthor();
  }, [])

  const formatDate = (dateString) => {
    return formatDistanceToNow(new Date(dateString), { addSuffix: true });
  };
  return (
    <Link to={`/posts/users/${authorID}`} className='post_author'>
      <div className="post_author-avatar">
        <img loading='lazy' src={author.avatar} alt={author.name} />
      </div>
      <div className="post_author-details">
        <h5 >By: {author.name}</h5>
        <small>{formatDate(createdAt)}</small>
      </div>
    </Link>
  );
};

export default PostAuthor;
