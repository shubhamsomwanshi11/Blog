import React from 'react';
import { Link } from 'react-router-dom';
import PostAuthor from './PostAuthor';

const PostItem = ({ id, category, thumbnail, title, authorID, createdAt }) => {
  return (
    <article className='post'>
      <Link to={`/posts/${id}`}>
        <div className="post_thumbnail">
          <img loading='lazy' src={thumbnail} alt={title} />
        </div>
        <div className="post_content">
          <h3>{title}</h3>
        </div>
      </Link>

      <div className="post_footer">
        <PostAuthor authorID={authorID} createdAt={createdAt} />
        <Link to={`/posts/categories/${category}`} className='btn category'>{category}</Link>
      </div>
    </article>
  );
};

export default PostItem;
