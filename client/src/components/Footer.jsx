import React from 'react'
import { Link } from 'react-router-dom'
const Footer = () => {
  const POST_CATEGORIES = [
    "Agriculture", "Business", "Education", "Entertainment",
    "Art", "Elections", "Investment", "Weather"
  ];
  return (

    <footer>
      <ul className='footer__categories'>
        <li><Link to='/posts/categories/Uncategorized'>Uncategorized</Link></li>
        {
          POST_CATEGORIES.map((cat) => (
            <li key={cat}><Link to={`/posts/categories/${cat}`}>{cat}</Link></li>
          ))
        }
      </ul>

      <div className="footer__copyright">
        <small>All Rights Reserver &copy; Copyright <a href="https://shubhamsomwanshi11.vercel.app/">@shubhamsomwanshi11</a></small>
      </div>
    </footer >
  )
}

export default Footer