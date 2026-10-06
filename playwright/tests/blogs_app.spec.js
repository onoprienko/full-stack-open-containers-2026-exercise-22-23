const { test, expect, beforeEach, describe } = require('@playwright/test');
const {
  login,
  testUserData,
  testUserData2,
  createNewBlog,
  testBlogData,
  testBlogData2,
} = require('./helper');

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset');
    await request.post('/api/users', { data: testUserData });
    await request.post('/api/users', { data: testUserData2 });

    await page.goto('/');
  });

  test('Login form is shown', async ({ page }) => {
    await page.getByText('login').click();
    const locator = page.getByText('Log in to application');
    await expect(locator).toBeVisible();
    await expect(page.getByLabel('username')).toBeVisible();
    await expect(page.getByLabel('password')).toBeVisible();
  });

  describe('Login', () => {
    test('Login succeeds with the correct username/password combination', async ({
      page,
    }) => {
      await login({ ...testUserData, page });
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible();
    });

    test('Login fails if the username/password is incorrect', async ({
      page,
    }) => {
      await login({
        page,
        username: 'testuser-bad',
        password: 'password-bad',
      });
      await expect(page.getByText('message: wrong credentials')).toBeVisible();
    });
  });

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await login({ ...testUserData, page });
      await expect(page.getByRole('heading', { name: 'blogs' })).toBeVisible();
      await createNewBlog({ ...testBlogData, page });
      await expect(
        page.getByRole('link', { name: 'test-title', exact: true }),
      ).toBeVisible();
    });

    test('A logged-in user can create a blog', async ({ page }) => {
      await expect(
        page.getByText('message: a new blog "test-title" added'),
      ).toBeVisible();
      await expect(
        page.getByRole('link', { name: 'test-title', exact: true }),
      ).toBeVisible();
    });

    test('A logged-in user can like blogs', async ({ page }) => {
      await page.getByRole('link', { name: 'test-title' }).click();
      await expect(
        page.getByRole('heading', { name: 'test-title' }),
      ).toBeVisible();
      await expect(await page.getByText('0 likes')).toBeVisible();
      await page.getByRole('button', { name: 'like' }).click();
      await expect(await page.getByText('1 likes')).toBeVisible();
    });

    test('A logged-in user can delete a blog', async ({ page }) => {
      await page.getByRole('link', { name: 'test-title' }).click();
      await page.on('dialog', (dialog) => dialog.accept());
      await page.getByRole('button', { name: 'remove' }).click();
      await page.getByRole('heading', { name: 'blogs' }).click();
      await expect(page.getByText('test-title test-author')).toHaveCount(0);
    });

    test('blog can NOT be deleted by wrong user', async ({ page }) => {
      await page.getByRole('button', { name: 'logout' }).click();
      await login({ ...testUserData2, page });
      await page.getByRole('link', { name: 'test-title', exact: true }).click();
      await expect(
        page.getByRole('heading', { name: 'test-title', exact: true }),
      ).toBeVisible();
      await expect(page.getByRole('button', { name: 'remove' })).toHaveCount(0);
    });

    test('blog with the most likes shows first', async ({ page }) => {
      await createNewBlog({ ...testBlogData2, page });

      await expect(
        await page.getByRole('link', { name: 'test-title2', exact: true }),
      ).toBeVisible();

      await page.getByRole('link', { name: /^test-title2$/i }).click();
      await page.getByRole('button', { name: 'like' }).click();
      await expect(await page.getByText('1 likes')).toBeVisible();
      await page.getByRole('link', { name: 'blogs' }).click();

      await expect(page.locator('.blog-list-item').first()).toHaveText(
        /^test-title2$/i,
      );
      await expect(page.locator('.blog-list-item').last()).toHaveText(
        /^test-title$/i,
      );
    });
  });
});
