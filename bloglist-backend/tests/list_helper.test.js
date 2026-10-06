const { test, describe } = require('node:test');
const assert = require('node:assert');
const listHelper = require('../utils/list_helper');
const helper = require('./test_helper');

test('dummy returns one', () => {
  const blogs = [];

  const result = listHelper.dummy(blogs);
  assert.strictEqual(result, 1);
});

describe('total likes', () => {
  test('of empty list is zero', () => {
    const result = listHelper.totalLikes([]);
    assert.strictEqual(result, 0);
  });

  test('when list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(helper.listWithOneBlog);
    assert.strictEqual(result, 5);
  });

  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(helper.initialBlogs);
    assert.strictEqual(result, 36);
  });
});

describe('favorite blog', () => {
  test('favorite blog with biggest number of likes', () => {
    const result = listHelper.favoriteBlog(helper.initialBlogs);
    assert.deepStrictEqual(result, helper.initialBlogs[2]);
  });
});

describe('most blogs', () => {
  test('author with the most blogs (without Lodash)', () => {
    const result = listHelper.mostBlogs(helper.initialBlogs);
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});

describe('most likes', () => {
  test('author with the most likes (without Lodash)', () => {
    const result = listHelper.mostLikes(helper.initialBlogs);
    assert.deepStrictEqual(result, {
      author: 'Edsger W. Dijkstra',
      likes: 17,
    });
  });
});

describe('most blogs (Lodash)', () => {
  test('author with the most blogs (Lodash)', () => {
    const result = listHelper.mostBlogsLodash(helper.initialBlogs);
    assert.deepStrictEqual(result, {
      author: 'Robert C. Martin',
      blogs: 3,
    });
  });
});
