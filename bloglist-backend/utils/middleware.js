const jwt = require('jsonwebtoken');

const errorHandler = (error, request, response, next) => {
  console.error('🔴', error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  if (
    error.name === 'MongoServerError' &&
    error.message.includes('E11000 duplicate key error')
  ) {
    return response
      .status(400)
      .json({ error: 'expected `username` to be unique' });
  }
  if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({ error: 'token invalid' });
  }
  if (error.name === 'TokenExpiredError') {
    return response.status(401).json({ error: 'token expired' });
  }
  next(error);
};

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    request.token = authorization.replace('Bearer ', '');
  } else {
    request.token = null;
  }
  next();
};

const userExtractor = (request, response, next) => {
  const authorization = request.get('authorization');
  if (authorization && authorization.startsWith('Bearer ')) {
    const decodedToken = jwt.verify(
      authorization.replace('Bearer ', ''),
      process.env.SECRET,
    );
    const { username, id } = decodedToken;
    request.user = { username, id };
  } else {
    request.user = null;
  }
  next();
};

module.exports = { errorHandler, tokenExtractor, userExtractor };
