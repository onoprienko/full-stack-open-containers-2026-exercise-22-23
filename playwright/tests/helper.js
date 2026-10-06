const { test, expect, beforeEach, describe } = require('@playwright/test');

const testUserData = {
  name: 'Test User',
  username: 'testuser',
  password: 'password',
};

const testUserData2 = {
  name: 'Test User 2',
  username: 'testuser2',
  password: 'password',
};

const testBlogData = {
  title: 'test-title',
  author: 'test-author',
  url: 'https://test.url',
};

const testBlogData2 = {
  title: 'test-title2',
  author: 'test-author2',
  url: 'https://test.url2',
};

const login = async ({ page, username, password }) => {
  await page.getByRole('link', { name: /login/i }).click();
  await expect(page.getByLabel('username')).toBeVisible();
  await page.getByLabel('username').fill(username);
  await page.getByLabel('password').fill(password);
  await page.getByRole('button', { name: /login/i }).click();
};

const createNewBlog = async ({ page, title, author, url }) => {
  await page.getByRole('link', { name: /new blog/i }).click();
  await expect(page.getByText('create new')).toBeVisible();
  await page.getByLabel('title').fill(title);
  await expect(page.getByLabel('author')).toBeVisible();
  await page.getByLabel('author').fill(author);
  await page.getByLabel('url').fill(url);
  await page.getByRole('button', { name: 'create' }).click();
};

export {
  login,
  testUserData,
  testUserData2,
  createNewBlog,
  testBlogData,
  testBlogData2,
};
