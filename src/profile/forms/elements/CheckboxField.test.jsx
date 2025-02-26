import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { TestableCheckboxField } from './CheckboxField';

const mockStore = configureStore([]);

describe('CheckboxField', () => {
  const defaultProps = {
    formId: 'test-checkbox',
    value: false,
    visibility: 'private',
    editMode: 'editing',
    saveState: null,
    error: null,
    label: 'Accept Terms',
    placeholder: 'Please accept',
    instructions: 'Check the box to continue',
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
          <TestableCheckboxField {...defaultProps} {...props} />
        </IntlProvider>
      </Provider>,
    );
  };

  it('renders checkbox in editing mode', () => {
    renderComponent();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
  });

  it('calls changeHandler when checkbox is clicked', () => {
    renderComponent();
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(defaultProps.changeHandler).toHaveBeenCalledWith('test-checkbox', true);
  });

  it('calls submitHandler when form is submitted', () => {
    renderComponent();
    const form = screen.getByTestId('test-form');
    fireEvent.submit(form);
    expect(defaultProps.submitHandler).toHaveBeenCalledWith('test-checkbox');
  });

  it('calls closeHandler when form is closed', () => {
    renderComponent();
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.closeHandler).toHaveBeenCalledWith('test-checkbox');
  });

  it('renders empty state when in empty mode', () => {
    renderComponent({ editMode: 'empty' });
    expect(screen.getByText('Check the box to continue')).toBeInTheDocument();
  });

  it('renders static mode with checked value', () => {
    renderComponent({ editMode: 'static', value: true });
    expect(screen.getByLabelText('Accept Terms')).toBeChecked();
  });

  it('renders editable mode with edit button', () => {
    renderComponent({ editMode: 'editable' });
    expect(screen.getByText('Accept Terms')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('calls openHandler when edit button is clicked', () => {
    renderComponent({ editMode: 'editable' });
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(defaultProps.openHandler).toHaveBeenCalledWith('test-checkbox');
  });
});
