const { test, after, beforeEach, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const Blog = require('../models/blog');
const helper = require('./test_helper');
const User = require('../models/user');
const bcrypt = require('bcrypt');

const api = supertest(app);

describe('📄 blogs_api_test.js', () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    const passwordHash = await bcrypt.hash('secret', 10);
    const user = new User({ username: 'root-blogs_api.test', passwordHash });
    const userResponse = await user.save();

    await Blog.deleteMany({});
    for (let blog of helper.initialBlogs) {
      let blogObject = new Blog(blog);
      blogObject.user = userResponse.id;
      await blogObject.save();
    }

    const loginResponse = await api
      .post('/api/login')
      .send({
        username: 'root-blogs_api.test',
        password: 'secret',
      })
      .expect(200)
      .expect('Content-Type', /application\/json/);
    token = loginResponse.body.token;
  });

  test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        assert.strictEqual(response.body.length, helper.initialBlogs.length);
      });
  });

  test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('identifier `id` is present', async () => {
    const response = await api.get('/api/blogs');
    assert.strictEqual(Object.keys(response.body[0]).includes('id'), true);
  });

  describe('🆕 blog creation. POST /api/blogs', () => {
    test('a valid blog can be added ', async () => {
      const newBlog = {
        title: 'test blog entry creation',
        author: 'test test',
        url: '#',
        likes: 8,
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      const response = await api.get('/api/blogs');
      const titles = response.body.map((r) => r.title);

      assert.strictEqual(response.body.length, helper.initialBlogs.length + 1);
      assert(titles.includes(newBlog.title));
    });

    test('verify default `likes` value is equal 0 if not provided on creation ', async () => {
      const newBlog = {
        title: 'test blog default likes value',
        author: 'test test',
        url: '#',
      };

      const createdBlog = await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(createdBlog.body.likes, 0);
    });

    test('test that on blog creation `title` and `url` property is present', async () => {
      const newBlogWithoutTitle = {
        author: 'test test',
        url: '#',
      };
      const newBlogWithoutUrl = {
        title: 'test blog default likes value',
        author: 'test test',
      };

      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithoutTitle)
        .expect(400);
      await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlogWithoutUrl)
        .expect(400);
    });
  });

  test('test blog delete by id', async () => {
    await api
      .delete(`/api/blogs/${helper.initialBlogs[0]._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send()
      .expect(204);
  });

  test('test blog update by id', async () => {
    const id = helper.initialBlogs[0]._id;
    const updatedBlog = {
      title: 'updated',
      url: 'updated',
      author: 'updated',
      likes: 9999999,
    };

    await api
      .put(`/api/blogs/${id}`)
      .send(updatedBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)
      .then((response) => {
        assert.strictEqual(response.body.title, updatedBlog.title);
        assert.strictEqual(response.body.url, updatedBlog.url);
        assert.strictEqual(response.body.author, updatedBlog.author);
        assert.strictEqual(response.body.likes, updatedBlog.likes);
        assert.strictEqual(response.body.id, id);
      });
  });
});

after(async () => {
  await mongoose.connection.close();
});
