import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import NewBlogForm from './NewBlogForm';

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

describe('<NewBlogForm />', () => {
  const formHandleMock = vi.fn();
  beforeEach(() => {
    render(<NewBlogForm formHandle={formHandleMock} />);
  });

  test('new blog form submit data', async () => {
    const user = userEvent.setup();
    const buttonCreate = screen.getByText('create');
    const inputTitle = screen.getByLabelText('title');
    const inputAuthor = screen.getByLabelText('author');
    const inputUrl = screen.getByLabelText('url');

    await user.type(inputTitle, 'testing title');
    await user.type(inputAuthor, 'testing author');
    await user.type(inputUrl, 'testing url');

    await user.click(buttonCreate);
    expect(formHandleMock.mock.calls).toHaveLength(1);
    expect(formHandleMock.mock.calls[0][0]).toEqual({
      title: 'testing title',
      author: 'testing author',
      url: 'testing url',
    });
  });
});
