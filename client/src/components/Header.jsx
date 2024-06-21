import React, { useContext, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../images/s.png'
import { FaBars } from 'react-icons/fa'
import { AiOutlineClose } from 'react-icons/ai'
import { userContext } from '../context/userContext'

const Header = () => {
  const { currentUser } = useContext(userContext);
  const [isNavShowinng, setisNavShowing] = useState(window.innerWidth > 800 ? true : false)
  const closeNavHandler = () => {
    if (window.innerWidth < 800) {
      setisNavShowing(false);
    }
    else {
      setisNavShowing(true)
    }
  }
  return (
    <nav>
      <div className="container nav__container">
        <Link to='/' className='nav__logo' onClick={closeNavHandler} >
          <img loading='lazy'  src={Logo} alt="" className='nav__img' />
        </Link>
        {currentUser?.id && isNavShowinng && <ul className='nav__menu'>
          <li><NavLink to={`/profile/${currentUser?.id}`} onClick={closeNavHandler}>Profile</NavLink></li>
          <li><NavLink to='/create' onClick={closeNavHandler}>Create Post</NavLink></li>
          <li><NavLink to='/authors' onClick={closeNavHandler}>Authors</NavLink></li>
          <li><NavLink to='/logout' onClick={closeNavHandler}>Logout</NavLink></li>
        </ul>
        }
        {!currentUser?.id && isNavShowinng && <ul className='nav__menu'>
          <li><NavLink to='/authors' onClick={closeNavHandler}>Authors</NavLink></li>
          <li><NavLink to='/register' onClick={closeNavHandler}>Register</NavLink></li>
          <li><NavLink to='/login' onClick={closeNavHandler}>Login</NavLink></li>
        </ul>
        }
        <button className='nav__toggle-btn' onClick={() => setisNavShowing(!isNavShowinng)}>
          {
            isNavShowinng ? <AiOutlineClose /> : <FaBars />
          }
        </button>
      </div>
    </nav>
  )
}

export default Header