import React, { useState } from 'react'
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom'
const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    password2: '',
  })

  const [error, setError] = useState('')
  const navigate = useNavigate();


  const changeInputHandler = (e) => {
    setUserData(prevState => {
      return { ...prevState, [e.target.name]: e.target.value }
    })
  }


  const registerUser = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/users/register`, userData);
      if (!response || !response.data) {
        setError(`Couldn't register user. Please try again.`);
        return;
      }
      const newUser = response.data;
      if (!newUser)
        setError(`Couldn't register user. Please try again.`);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
  }

  return (
    <section className="register">
      <div className="container">
        <h2>Sign Up</h2>
        <form action="" className="form register-form" onSubmit={registerUser}>
          {error && <p className="form-error-message">{error}</p>}
          <input type="text" placeholder='Full Name' name='name' value={userData.name} onInput={changeInputHandler} />
          <input type="email" placeholder='ns@gmail.com' name='email' value={userData.email} onInput={changeInputHandler} />
          <input type="password" placeholder='Password' name='password' value={userData.password} onInput={changeInputHandler} />
          <input type="password" placeholder='Confirm Password' name='password2' value={userData.password2} onInput={changeInputHandler} />
          <button type='submit' className='btn' style={{ backgroundColor: 'green', color: 'white' }}>
            Register
          </button>
        </form>
        <small>Alredy have an account ? <Link to='/login' >Login</Link></small>
      </div>
    </section>
  )
}

export default Register