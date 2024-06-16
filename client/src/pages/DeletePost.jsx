import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaTrash } from "react-icons/fa";
import axios from 'axios';
import { userContext } from '../context/userContext';

const DeletePost = ({ id, onDelete }) => {
  const { currentUser } = useContext(userContext);
  const token = currentUser?.token;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) navigate('/login');
  }, [token, navigate]);

  const deletePost = async () => {
    if (window.confirm("Do you really want to delete the post?"))
      try {
        await axios.delete(`${process.env.REACT_APP_BASE_URL}api/posts/delete/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("Post deleted successfully.");
        onDelete(id);
        navigate(`/myposts/${currentUser.id}`);
      } catch (error) {
        alert(error.response?.data?.message || 'An error occurred while deleting the post.');
      }
  };

  return (
    <button className="btn sm danger" onClick={deletePost}>
      <FaTrash />
    </button>
  );
};

export default DeletePost;
