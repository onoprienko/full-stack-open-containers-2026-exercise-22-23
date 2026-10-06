import { useState, useEffect, useRef } from 'react';
import { Routes, Route, Link, useMatch } from 'react-router-dom';
import Blog from './components/Blog';
import blogService from './services/blogs';
import Notification from './components/Notification';
import NewBlogForm from './components/NewBlogForm';
import Togglable from './components/Togglable';
import LoginForm from './components/LoginForm';
import { AppBar, Box, Toolbar, Typography, Button } from '@mui/material';

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [user, setUser] = useState(null);

  const newBlogFormRef = useRef();

  const match = useMatch('/blogs/:id');
  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  const [notificationMessage, setNotificationMessage] = useState({
    message: null,
    type: null,
  });

  useEffect(() => {
    blogService
      .getAll()
      .then((blogs) => setBlogs(blogs.sort((a, b) => b.likes - a.likes)));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const logout = (e) => {
    e.preventDefault();
    window.localStorage.removeItem('loggedUser');
    setUser(null);
  };

  const likeButtonHandler = async (blog) => {
    const updatedBlog = await blogService.update(blog.id, {
      ...blog,
      likes: blog.likes + 1,
    });
    const updatedBlogs = blogs.map((blog) => {
      if (blog.id === updatedBlog.id) blog.likes = updatedBlog.likes;
      return blog;
    });
    setBlogs(updatedBlogs.sort((a, b) => b.likes - a.likes));
  };

  const style = {
    '&:hover': { bgcolor: 'rgba(255,255,255,0.3)' },
  };

  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Blog App
            </Typography>
            <nav>
              <Button component={Link} to="/" color="inherit" sx={style}>
                blogs
              </Button>
              {user && (
                <Button
                  component={Link}
                  to="/create"
                  color="inherit"
                  sx={style}
                >
                  new blog
                </Button>
              )}
              {user ? (
                <Button color="inherit" onClick={logout} sx={style}>
                  logout
                </Button>
              ) : (
                <Button component={Link} to="/login" color="inherit" sx={style}>
                  login
                </Button>
              )}
            </nav>
          </Toolbar>
        </AppBar>
      </Box>

      <Notification
        notificationMessage={notificationMessage}
        setNotificationMessage={setNotificationMessage}
      />

      <Routes>
        <Route path="/login" element={<LoginForm setUser={setUser} />} />
        <Route
          path="/"
          element={
            <>
              <h2>blogs</h2>
              {blogs.map((blog) => (
                <li key={blog.id} className={'blog-list-item'}>
                  <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
                </li>
              ))}
            </>
          }
        />
        <Route
          path="/blogs/:id"
          element={
            <Blog
              blog={blog}
              blogs={blogs}
              setBlogs={setBlogs}
              user={user}
              likeButtonHandler={likeButtonHandler}
            />
          }
        />
        <Route
          path="/create"
          element={
            <Togglable buttonText="create new blog" ref={newBlogFormRef}>
              <NewBlogForm
                blogs={blogs}
                setBlogs={setBlogs}
                setNotificationMessage={setNotificationMessage}
                newBlogFormRef={newBlogFormRef}
              />
            </Togglable>
          }
        />
      </Routes>
    </>
  );
};

export default App;
