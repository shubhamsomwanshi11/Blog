import React, { useContext, useEffect } from 'react'
import { UserContext, userContext } from '../context/userContext'
import { useNavigate } from 'react-router-dom'
const Logout = () => {
  const {setCurrentUser} = useContext(userContext);
  const navigate = useNavigate();
  setCurrentUser(null)
  navigate('/login')
  return (
    <></>
  )
}

export default Logout