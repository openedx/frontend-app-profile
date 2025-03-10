import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { TestableTextField } from './TextField';

const mockStore = configureStore([]);

describe('TextField', () => {
  const defaultProps = {
    formId: 'test-text',
    value: '',
    visibility: 'private',
    editMode: 'editing',
    saveState: null,
    error: null,
    label: 'Username',
    placeholder: 'Enter your username',
    instructions: 'Provide a unique username',
    changeHandler: jest.fn(),
    submitHandler: jest.fn(),
    closeHandler: jest.fn(),
    openHandler: jest.fn(),
  };

  let store;

  beforeEach(() => {
    store = mockStore({});
  });

  const renderComponent = (props = {}) => {
    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <TestableTextField {...defaultProps} {...props} />
        </IntlProvider>
      </Provider>,
    );
  };

  it('renders text field in editing mode', () => {
    renderComponent();
    expect(screen.getByLabelText('Username')).toBeInTheDocument();
  });

  it('calls changeHandler when text is entered', () => {
    renderComponent();
    const input = screen.getByLabelText('Username');
    fireEvent.change(input, { target: { value: 'new-user' } });
    expect(defaultProps.changeHandler).toHaveBeenCalledWith('test-text', 'new-user');
  });

  it('calls submitHandler when form is submitted', () => {
    renderComponent();
    const form = screen.getByTestId('test-form');
    fireEvent.submit(form);
    expect(defaultProps.submitHandler).toHaveBeenCalledWith('test-text');
  });

  it('calls closeHandler when form is closed', () => {
    renderComponent();
    defaultProps.closeHandler.mockClear();
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.closeHandler).toHaveBeenCalledWith('test-text');
  });

  it('renders empty state when in empty mode', () => {
    renderComponent({ editMode: 'empty' });
    expect(screen.getByText('Provide a unique username')).toBeInTheDocument();
    expect(screen.getByText('Enter your username')).toBeInTheDocument();
  });

  it('renders static mode with entered value', () => {
    renderComponent({ editMode: 'static', value: 'existing-user' });
    expect(screen.getByText('existing-user')).toBeInTheDocument();
  });

  it('renders editable mode with edit button', () => {
    renderComponent({ editMode: 'editable' });
    expect(screen.getByText('Username')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('calls openHandler when edit button is clicked', () => {
    renderComponent({ editMode: 'editable' });
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(defaultProps.openHandler).toHaveBeenCalledWith('test-text');
  });
});
