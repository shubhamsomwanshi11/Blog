import React, { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { UserContext, userContext } from '../context/userContext.js'
const Login = () => {
  const [userData, setUserData] = useState({
    email: '',
    password: '',
  })

  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { setCurrentUser } = useContext(userContext);

  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }

  const loginUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/users/login`, userData);
      const user = await response.data;
      setCurrentUser(user);
      navigate('/');
    } catch (err) {
      setError(err.response.data.message)
    }

  }
  return (
    <section className="register">
      <div className="container">
        <h2>Login</h2>
        <form action="" className="form register-form" onSubmit={loginUser}>
          {error && <p className="form-error-message">{error}</p>}
          <input type="email" placeholder='ns@gmail.com' name='email' value={userData.email} onInput={changeInputHandler} autoFocus />
          <input type="password"placeholder='Password'  name='password' value={userData.password} onInput={changeInputHandler} />
          <button type='submit' className='btn' style={{ backgroundColor: 'green', color: 'white' }}>
            Login
          </button>
        </form>
        <small>Don't have an account ? <Link to='/register' >Register</Link></small>
      </div>
    </section>
  )
}

export default Login