import React, { useContext, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEdit, FaCheck } from 'react-icons/fa';
import { userContext } from '../context/userContext'
import Loader from '../components/Loader'
import axios from 'axios'

const UserProfile = () => {
  const [avatar, setAvatar] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmNewPassword] = useState('');
  const { currentUser } = useContext(userContext);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAvatarTouched, setIsAvatarTouched] = useState(false);
  const token = currentUser?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login')
    }
    const getUser = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/users/${currentUser.id}`);
        if (response) {
          setName(response.data.name);
          setEmail(response.data.email);
          if (response.data.avatar) setAvatar(response.data.avatar);
        }
      } catch (error) {
        setError(error.response?.data?.message || 'An error occurred');
      }
      setIsLoading(false);
    }
    getUser();
  }, [token, navigate, currentUser.id]);

  const updateUserDetails = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const userData = { name, email, currentPassword, newPassword, confirmPassword };
      await axios.patch(`${process.env.REACT_APP_BASE_URL}api/users/edit-user`, userData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
    setIsLoading(false);
  };

  const changeAvatarHandler = async () => {
    setIsLoading(true);
    setIsAvatarTouched(false);
    try {
      const postData = new FormData();
      postData.set('avatar', avatar);
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}api/users/change-avatar`, postData, { withCredentials: true, headers: { Authorization: `Bearer ${token}` } });
      setAvatar(response?.data.avatar);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    }
    setIsLoading(false);
  }

  const handleAvatarChange = (e) => {
    setAvatar(e.target.files[0]);
    setIsAvatarTouched(true);
  };

  if (isLoading)
    return <Loader />

  return (
    <section className="profile">
      <div className="container profile-container">
        <Link to={`/myposts/${currentUser.id}`} className='btn'>My posts</Link>
        <div className="profile-details">
          <div className="avatar-wrapper">
            <div className="profile-avatar">
              <img loading='lazy' src={avatar} alt="" />
            </div>
            <form action="" className="avatar-form">
              <input type="file" name="avatar" id='avatar' onChange={handleAvatarChange} accept='.png,.jpg,.jpeg' />
              <label htmlFor="avatar" onClick={() => setIsAvatarTouched(true)}><FaEdit /></label>
            </form>
            {isAvatarTouched && <button onClick={changeAvatarHandler} className='profile-avatar-btn'><FaCheck /></button>}
          </div>
          <h1>{name}</h1>
          <form action="" className="form profile-form" onSubmit={updateUserDetails}>
            {error && <p className="form-error-message">
              {error}
            </p>}
            <input type="text" placeholder='Shubham Somwanshi' name='name' value={name} onChange={e => setName(e.target.value)} />
            <input type="email" placeholder='shubhamsomwanshi11@gmail.com' name='email' value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder='Password' name='password' value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} />
            <input type="password" placeholder='New Password' name='password' value={newPassword} onChange={e => setNewPassword(e.target.value)} />
            <input type="password" placeholder='Confirm New Password' name='password' value={confirmPassword} onChange={e => setConfirmNewPassword(e.target.value)} />
            <button type='submit' className='btn primary'>Save</button>
          </form>
        </div>
      </div>
    </section>
  )
}

export default UserProfile
