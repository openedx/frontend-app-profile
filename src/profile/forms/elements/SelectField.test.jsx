import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { TestableSelectField } from './SelectField';

const mockStore = configureStore([]);

describe('SelectField', () => {
  const defaultProps = {
    formId: 'test-select',
    value: '',
    visibility: 'private',
    editMode: 'editing',
    saveState: null,
    error: null,
    options: [
      { value: 'ca', name: 'Canada' },
      { value: 'us', name: 'United States' },
      { value: 'mx', name: 'Mexico' },
    ],
    label: 'Country',
    emptyMessage: 'No country selected',
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
          <TestableSelectField {...defaultProps} {...props} />
        </IntlProvider>
      </Provider>,
    );
  };

  it('renders select field in editing mode', () => {
    renderComponent();
    expect(screen.getByLabelText('Country')).toBeInTheDocument();
  });

  it('calls changeHandler when an option is selected', () => {
    renderComponent();
    const select = screen.getByLabelText('Country');
    fireEvent.change(select, { target: { value: 'ca' } });
    expect(defaultProps.changeHandler).toHaveBeenCalledWith('test-select', 'ca');
  });

  it('calls submitHandler when form is submitted', () => {
    renderComponent();
    const form = screen.getByTestId('test-form');
    fireEvent.submit(form);
    expect(defaultProps.submitHandler).toHaveBeenCalledWith('test-select');
  });

  it('calls closeHandler when form is closed', () => {
    renderComponent();
    defaultProps.closeHandler.mockClear();
    fireEvent.click(screen.getByText('Cancel'));
    expect(defaultProps.closeHandler).toHaveBeenCalledWith('test-select');
  });

  it('renders empty state when in empty mode', () => {
    renderComponent({ editMode: 'empty' });
    expect(screen.getByText('No country selected')).toBeInTheDocument();
  });

  it('renders static mode with selected value', () => {
    renderComponent({ editMode: 'static', value: 'United States' });
    expect(screen.getByText('United States')).toBeInTheDocument();
  });

  it('renders editable mode with edit button', () => {
    renderComponent({ editMode: 'editable' });
    expect(screen.getByText('Country')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit/i })).toBeInTheDocument();
  });

  it('calls openHandler when edit button is clicked', () => {
    renderComponent({ editMode: 'editable' });
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(defaultProps.openHandler).toHaveBeenCalledWith('test-select');
  });
});
