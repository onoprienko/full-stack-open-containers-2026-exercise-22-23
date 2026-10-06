const blogRouter = require('express').Router();
const Blog = require('../models/blog');
const User = require('../models/user');

blogRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { username: 1, name: 1 });
  response.json(blogs);
});

blogRouter.post('/', async (request, response) => {
  if (!request.user.id) {
    return response.status(401).json({ error: 'token invalid' });
  }
  let user = await User.findById(request.user.id);
  if (!user) {
    const users = await User.find({});
    if (!users[0]) {
      return response
        .status(400)
        .json({ error: 'userId missing. And there is no users in database' });
    }
    user = users[0];
  }
  const blog = new Blog({ ...request.body, user: user._id });
  await blog.save();
  const result = await blog.populate('user', { id: 1, username: 1, name: 1 });

  user.blogs = user.blogs.concat(result._id);
  await user.save();

  response.status(201).json(result);
});

blogRouter.put('/:id', async (request, response) => {
  const { id } = request.params;
  const { title, author, likes, url } = request.body;

  const blogToUpdate = await Blog.findById(id);

  blogToUpdate.title = title;
  blogToUpdate.author = author;
  blogToUpdate.likes = likes;
  blogToUpdate.url = url;

  await blogToUpdate.save();

  response.json(blogToUpdate);
});

blogRouter.delete('/:id', async (request, response) => {
  if (!request.user) {
    return response.status(401).json({ error: 'invalid token' });
  }

  const { id } = request.params;
  const blog = await Blog.findById(id);

  if (!blog) return response.status(400).json({ error: 'blog not found' });

  if (request.user.id !== blog.user.toString()) {
    return response
      .status(403)
      .json({ error: 'this user have not permissions to delete this entry' });
  }

  await Blog.findByIdAndDelete(id);
  response.status(204).end();
});

module.exports = blogRouter;
