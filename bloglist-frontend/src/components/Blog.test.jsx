import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Blog from './Blog';

// Create a mock navigation function
const mockNavigate = vi.fn();
// Mock the react-router-dom module
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const blog = {
  title: 'test-blog title',
  author: 'test author',
  url: 'https://test',
  likes: 1,
  user: {
    id: 'testid',
    name: 'test-user',
  },
};

describe('<Blog />', () => {
  const likeButtonHandlerMock = vi.fn();

  beforeEach(() => {
    render(
      <Blog
        blog={blog}
        user={blog.user}
        likeButtonHandler={likeButtonHandlerMock}
      />,
    );
  });

  test('renders content', () => {
    expect(screen.getByText('test-blog title')).toBeDefined();
    expect(screen.getByText('by test author')).toBeDefined();
    expect(screen.queryByText('https://test')).toBeInTheDocument();
    expect(screen.queryByText('1 likes')).toBeInTheDocument();
    expect(screen.queryByText('Added by test-user')).toBeInTheDocument();
  });

  // test('it is possible to hide content', async () => {
  //   const user = userEvent.setup();
  //   const button = screen.getByText('hide');
  //   await user.click(button);

  //   expect(screen.queryByText('https://test')).not.toBeInTheDocument();
  //   expect(screen.queryByText('1 likes')).not.toBeInTheDocument();
  //   expect(screen.queryByText('test-user')).not.toBeInTheDocument();
  // });

  test('like button click', async () => {
    const user = userEvent.setup();

    const buttonLike = screen.getByText('like');
    await user.click(buttonLike);

    expect(likeButtonHandlerMock.mock.calls).toHaveLength(1);
    await user.click(buttonLike);
    expect(likeButtonHandlerMock.mock.calls).toHaveLength(2);
  });

  test('matches snapshot', () => {
    const { container } = render(
      <Blog
        blog={blog}
        user={blog.user}
        likeButtonHandler={likeButtonHandlerMock}
      />,
    );
    expect(container.firstChild).toMatchSnapshot();
  });
});

describe('<Blog /> 5.27', () => {
  test('Blog information and the number of likes are displayed to unauthenticated users, buttons are not displayed', () => {
    render(<Blog blog={blog} user={null} />);
    expect(screen.getByText('test-blog title')).toBeDefined();
    expect(screen.queryByText('https://test')).toBeInTheDocument();
    expect(screen.queryByText('1 likes')).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'like' }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument();
  });

  test('Authenticated users who are not the blog’s creator are shown only the like button', () => {
    render(
      <Blog
        blog={blog}
        user={{
          id: 'testid-wrong',
          name: 'test-user-wrong',
        }}
      />,
    );
    expect(screen.getByText('test-blog title')).toBeDefined();
    expect(screen.queryByText('https://test')).toBeInTheDocument();
    expect(screen.queryByText('1 likes')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'like' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).not.toBeInTheDocument();
  });

  test('The blog’s creator is also shown the delete button', () => {
    render(<Blog blog={blog} user={blog.user} />);
    expect(screen.getByText('test-blog title')).toBeDefined();
    expect(screen.queryByText('https://test')).toBeInTheDocument();
    expect(screen.queryByText('1 likes')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'like' })).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: 'remove' }),
    ).toBeInTheDocument();
  });
});
