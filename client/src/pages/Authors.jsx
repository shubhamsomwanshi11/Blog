import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import avatar from '../images/avatar11.jpg'
import Loader from '../components/Loader'

const Authors = () => {
  const [authors, setAuthors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const getAuthors = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/users`)
        if (response) {
          setAuthors(response.data)
        }

      } catch (error) {
        console.error(error);
      }
      setIsLoading(false);
    }
    getAuthors();
  }, [])

  if (isLoading)
    return <Loader />
  return (
    <section className="authors">
      {authors && authors.length > 0 ? (
        <div className="container authors-container">
          {authors.map((author) => (
            <Link key={author._id} to={`/posts/users/${author._id}`} className='author'>
              <div className="author-avatar">
                <img src={`${process.env.REACT_APP_ASSETS_URL}/uploads/${author.avatar}`} alt={author.name || 'Author Name'} onError={(e) => { e.target.src = avatar; }} /> {/* Handle missing avatar */}
              </div>
              <div className="author-info">
                <h4>{author.name}</h4>
                <p>{author.posts} Posts</p>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <h2 className='center'>No Authors found.</h2>
      )}
    </section>
  )
}

export default Authors