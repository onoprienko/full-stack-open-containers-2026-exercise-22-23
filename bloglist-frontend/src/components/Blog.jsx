import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import blogService from '../services/blogs';
import { Box, Paper, Typography, Button, Link } from '@mui/material';

const Blog = ({ blog, blogs, setBlogs, user, likeButtonHandler }) => {
  const [showBlog, setShowBlog] = useState(true);

  const navigate = useNavigate();
  const showBlogToggle = () => setShowBlog(!showBlog);
  console.log(showBlogToggle);

  const blogRemove = async () => {
    if (window.confirm(`Remove blog "${blog.title}" by ${blog.author}`)) {
      try {
        await blogService.remove(blog.id);
        setBlogs(blogs.filter((item) => item.id !== blog.id));
        navigate('/');
      } catch {
        console.log('🔴 record was not deleted');
      }
    }
  };

  // TODO: this is wierd condition to control
  if (!blog?.title) return null;
  return (
    <Paper
      className="blog"
      sx={{
        padding: '20px',
      }}
    >
      <Typography variant="h4" gutterBottom>
        {blog.title}
        {/* <button onClick={showBlogToggle}>{showBlog ? 'hide' : 'view'}</button> */}
      </Typography>
      {showBlog && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
          }}
        >
          {blog.user && (
            <Typography
              variant="h6"
              gutterNonoe
              sx={{
                color: '#666',
              }}
            >
              by {blog.author}
            </Typography>
          )}
          <Link href={blog.url} variant="body1">
            {blog.url}
          </Link>
          <Typography
            variant="body1"
            gutterNone
            sx={{
              color: '#666',
            }}
          >
            Added by {blog.user.name}
          </Typography>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'baseline',
              gap: '8px',
            }}
          >
            <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
              {blog.likes} likes
            </Typography>
            {user && (
              <Button
                type="submit"
                variant="outlined"
                onClick={() => likeButtonHandler(blog)}
              >
                like
              </Button>
            )}
            {user?.id === blog.user?.id && (
              <Button
                type="submit"
                variant="outlined"
                color="error"
                onClick={blogRemove}
              >
                remove
              </Button>
            )}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default Blog;
