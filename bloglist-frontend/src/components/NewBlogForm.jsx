import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TextField, Button } from '@mui/material';

import blogService from '../services/blogs';

const NewBlogForm = ({
  blogs,
  setBlogs,
  setNotificationMessage,
  newBlogFormRef,
  formHandle,
}) => {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [url, setUrl] = useState('');

  const navigate = useNavigate();

  const handleCreateNew = (e) => {
    e.preventDefault();
    if (formHandle) {
      formHandle({ title, author, url });
      return;
    }
    createNew();
  };

  const createNew = () => {
    if (!title || !author || !url) {
      return setNotificationMessage({
        message: 'some fields are empty',
        type: 'error',
      });
    }

    blogService.create({ title, author, url }).then((blog) => {
      setBlogs(blogs.concat(blog));
      setTitle('');
      setAuthor('');
      setUrl('');

      newBlogFormRef.current.openToggle();

      setNotificationMessage({
        message: `a new blog "${blog.title}" added`,
        type: 'success',
      });
      navigate('/');
    });
  };

  return (
    <>
      <h2>create new</h2>
      <form onSubmit={handleCreateNew} className="newblog-form">
        <TextField
          label="title"
          value={title}
          onChange={({ target }) => setTitle(target.value)}
          size="small"
        />
        <TextField
          label="author"
          value={author}
          onChange={({ target }) => setAuthor(target.value)}
          size="small"
        />
        <TextField
          label="url"
          value={url}
          onChange={({ target }) => setUrl(target.value)}
          size="small"
        />
        <Button type="submit" variant="contained" style={{ marginTop: 10 }}>
          create
        </Button>
      </form>
    </>
  );
};

export default NewBlogForm;
