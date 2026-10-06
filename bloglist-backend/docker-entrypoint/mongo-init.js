/* eslint-disable no-undef */
db.createUser({
  user: 'the_username',
  pwd: 'the_password',
  roles: [
    {
      role: 'dbOwner',
      db: 'the_database',
    },
  ],
});

db.createCollection('users');

const userResult = db.users.insertOne({
  username: 'dev',
  name: 'dev',
});

db.createCollection('blogs');

db.blogs.insert({
  title: 'dev-title',
  author: 'dev-author',
  url: 'dev-url',
  likes: 8,
  user: userResult.insertedId,
});
