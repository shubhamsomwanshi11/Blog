import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate, useParams } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { userContext } from '../context/userContext';
import Loader from '../components/Loader';
import axios from 'axios';

const UpdatePost = () => {
  const { currentUser } = useContext(userContext);
  const token = currentUser?.token;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [postId, setPostID] = useState(null);
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { id } = useParams();

  useEffect(() => {
    if (!token) navigate('/login');

    const getPostInfo = async () => {
      setIsLoading(true)
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}api/posts/${id}`);
        if (response) {
          setTitle(response.data.title);
          setCategory(response.data.category);
          setDescription(response.data.description);
          setPostID(response.data._id);
        }

      } catch (err) {
        setError(err.response?.data?.message || 'An error occurred');
      }
    }
    getPostInfo();
    setIsLoading(false)
  }, [token, navigate]);

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }, { 'indent': '-1' }, { 'indent': '+1' }],
      ['link', 'image'],
      ['clean'],
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike', 'blockquote',
    'list', 'bullet', 'indent', 'link', 'image',
  ];

  const POST_CATEGORIES = [
    "Agriculture", "Business", "Education", "Entertainment",
    "Art", "Elections", "Investment", "Weather"
  ];

  const updatePost = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('category', category);
      postData.append('description', description);
      if (thumbnail) postData.append('thumbnail', thumbnail);

      await axios.patch(`${process.env.REACT_APP_BASE_URL}api/posts/update/${id}`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post updated sucessfully.")
      navigate(`/posts/${postId}`);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
    setIsLoading(false);
  };

  if (isLoading) return <Loader />;

  return (
    <section className="create-post">
      <div className="container">
        <h2>Update Post</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form className="form create-post-form" style={{ marginTop: '1rem' }} onSubmit={updatePost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            {POST_CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ReactQuill modules={modules} formats={formats} value={description} onChange={setDescription} />
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
            accept="image/png, image/jpg, image/jpeg"
          />
          <button type="submit" className="btn primary">Update</button>
        </form>
      </div>
    </section>
  );
};

export default UpdatePost;
