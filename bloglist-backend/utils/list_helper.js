const groupBy = require('lodash/groupBy');
const maxBy = require('lodash/maxBy');
const map = require('lodash/map');

const dummy = () => 1;

const totalLikes = (blogs) => blogs.reduce((acc, blog) => acc + blog.likes, 0);

const favoriteBlog = (blogs) => {
  return blogs.reduce((favorite, blog) => {
    if (blog.likes < favorite.likes) return favorite;
    return blog;
  }, {});
};

const mostBlogs = (blogs) => {
  if (!blogs.length) return {};

  let topAuthor = { author: '', blogs: 0 };
  const authors = new Map();

  for (const blog of blogs) {
    const authorBlogsCount = authors.get(blog.author) || 0;
    const blogsCountNew = authorBlogsCount ? authorBlogsCount + 1 : 1;
    authors.set(blog.author, blogsCountNew);

    if (topAuthor.blogs < blogsCountNew) {
      topAuthor.author = blog.author;
      topAuthor.blogs = blogsCountNew;
    }
  }

  return topAuthor;
};

const mostLikes = (blogs) => {
  if (!blogs.length) return {};

  let topAuthor = { author: '', likes: 0 };
  const authors = new Map();

  for (const blog of blogs) {
    const authorLikesCount = authors.get(blog.author) || 0;
    const likesCountNew = authorLikesCount
      ? authorLikesCount + blog.likes
      : blog.likes;
    authors.set(blog.author, likesCountNew);

    if (topAuthor.likes < likesCountNew) {
      topAuthor.author = blog.author;
      topAuthor.likes = likesCountNew;
    }
  }

  return topAuthor;
};

// just to take a look at Lodash
const mostBlogsLodash = (blogs) => {
  const autorsObject = groupBy(blogs, 'author');
  const autorsArray = map(autorsObject, (item) => {
    return { author: item[0].author, blogs: item.length };
  });

  return maxBy(autorsArray, 'blogs');
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
  mostBlogsLodash,
};
