const express = require('express');
const dns = require('node:dns');
const mongoose = require('mongoose');
const blogsRouter = require('./controllers/blogs');
const usersRouter = require('./controllers/users');
const loginRouter = require('./controllers/login');
const config = require('./utils/config');
const middleware = require('./utils/middleware');

const app = express();

dns.setServers(['1.1.1.1', '8.8.8.8']);
mongoose.connect(config.MONGO_URI, { family: 4 });

app.use(express.json());
app.use(middleware.tokenExtractor);
app.use('/api/blogs', middleware.userExtractor, blogsRouter);
app.use('/api/users', usersRouter);
app.use('/api/login', loginRouter);

app.use(express.static('../dist'));

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing');
  app.use('/api/testing', testingRouter);
}

app.use(middleware.errorHandler);

module.exports = app;
