import React, { useContext, useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import { useNavigate } from 'react-router-dom';
import 'react-quill/dist/quill.snow.css';
import { userContext } from '../context/userContext';
import Loader from '../components/Loader';
import axios from 'axios';

const CreatePost = () => {
  const { currentUser } = useContext(userContext);
  const token = currentUser?.token;
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Uncategorized');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) navigate('/login');
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

  const publishPost = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    try {
      const postData = new FormData();
      postData.append('title', title);
      postData.append('category', category);
      postData.append('description', description);
      if (thumbnail) postData.append('thumbnail', thumbnail);

      await axios.post(`${process.env.REACT_APP_BASE_URL}api/posts/create`, postData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Post published sucessfully.")
      navigate(`/myposts/${currentUser.id}`);
    } catch (error) {
      setError(error.response?.data?.message || 'An error occurred');
    }
    setIsLoading(false);
  };

  if (isLoading) return <Loader />;

  return (
    <section className="create-post">
      <div className="container">
        <h2>Create Post</h2>
        {error && <p className="form-error-message">{error}</p>}
        <form className="form create-post-form" style={{ marginTop: '1rem' }} onSubmit={publishPost}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            name="title"
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
          />
          <select name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="Uncategorized" >Uncategorized</option>
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
          <button type="submit" className="btn primary">Publish</button>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
