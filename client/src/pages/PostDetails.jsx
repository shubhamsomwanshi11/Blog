import React, { useContext, useEffect, useState } from 'react'
import PostAuthor from '../components/PostAuthor';
import { Link, useParams } from 'react-router-dom';
import Thumbnail from '../images/blog1.jpg';
import axios from 'axios';
import { userContext } from '../context/userContext'
import DeletePost from './DeletePost';
import Loader from '../components/Loader';
const PostDetails = () => {
  const [post, setPost] = useState(null)
  const [creatorID, setCreatorID] = useState(null)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const { currentUser } = useContext(userContext);

  const { id } = useParams()
  useEffect(() => {
    const getPost = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/posts/${id}`);
        if (response) {
          setPost(response.data);
          setCreatorID(response.data.creator)
        }
        setIsLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred');
      }
    }
    getPost();
  }, [])

  if (isLoading)
    return <Loader />

  return (
    <section className="post-detail">
      {error && <p className='error'>{error}</p>}
      {post && <div className="container post-detail-container">
        <div className="post-detail-header">
          {creatorID && <PostAuthor authorID={creatorID} createdAt={post.createdAt} />}
          {currentUser?.id == post?.creator && <div className="post-detail-buttons">
            <Link to={`/posts/${id}/edit`} className="btn category sm">Edit</Link>
            <DeletePost id={id} />
          </div>}
        </div>
        <h1>{post.title}</h1>
        <div className='post-detail-thumbnail'>
          <img src={post.thumbnail ? `${process.env.REACT_APP_ASSETS_URL}/uploads/${post.thumbnail}` : Thumbnail} alt="" />
        </div>
        <div dangerouslySetInnerHTML={{ __html: post.description }} />
      </div>}
    </section >
  )
}

export default PostDetails