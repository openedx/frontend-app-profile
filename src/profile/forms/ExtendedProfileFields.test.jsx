import React from 'react';
import {
  render, screen, fireEvent,
} from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { IntlProvider } from '@edx/frontend-platform/i18n';

import { TestableExtendedProfileFields as ExtendedProfileFields } from './ExtendedProfileFields';

jest.mock('./elements/SelectField', () => jest.fn((props) => (
  <form onSubmit={props.submitHandler} data-testid="test-form">
    <select data-testid="select-field" aria-label={props.label} value={props.value} onChange={(e) => props.changeHandler(props.formId, e.target.value)}>
      {props.options.map((option) => (
        <option key={option.value} value={option.value}>{option.label}</option>
      ))}
    </select>
  </form>
)));
jest.mock('./elements/TextField', () => jest.fn((props) => (
  <form onSubmit={props.submitHandler} data-testid="test-form">
    <input data-testid="text-field" type="text" aria-label={props.label} value={props.value} onChange={(e) => props.changeHandler(props.formId, e.target.value)} />
  </form>
)));
jest.mock('./elements/CheckboxField', () => jest.fn((props) => (
  <form onSubmit={props.submitHandler} data-testid="test-form">
    <input data-testid="checkbox-field" type="checkbox" aria-label={props.label} checked={props.value} onChange={(e) => props.changeHandler(props.formId, e.target.checked)} />
  </form>
)));

const mockStore = configureStore([]);

describe('ExtendedProfileFields', () => {
  const store = mockStore({
    profilePage: {
      drafts: {},
      account: {
        extendedProfile: [
          { fieldName: 'first_name', fieldValue: 'John' },
        ],
      },
      preferences: { visibilityExtendedProfile: {} },
    },
  });

  const renderComponent = (fields, props = {}) => {
    render(
      <Provider store={store}>
        <IntlProvider locale="en">
          <ExtendedProfileFields
            formId="test-form"
            extendedProfileFields={fields}
            changeHandler={jest.fn()}
            submitHandler={jest.fn()}
            closeHandler={jest.fn()}
            openHandler={jest.fn()}
            isAuthenticatedUserProfile
            intl={{ formatMessage: jest.fn(() => 'Empty field') }}
            {...props}
          />
        </IntlProvider>
      </Provider>,
    );
  };

  it('renders SelectField when field type is select', () => {
    renderComponent([
      {
        name: 'country', type: 'select', label: 'Country', value: '', options: [{ value: 'us', label: 'USA' }],
      },
    ]);
    expect(screen.getByTestId('select-field')).toBeInTheDocument();
  });

  it('renders TextField when field type is text', () => {
    renderComponent([
      {
        name: 'first_name', type: 'text', label: 'First Name', value: 'John',
      },
    ]);
    expect(screen.getByTestId('text-field')).toBeInTheDocument();
  });

  it('renders CheckboxField when field type is checkbox', () => {
    renderComponent([
      {
        name: 'newsletter', type: 'checkbox', label: 'Subscribe', value: false,
      },
    ]);
    expect(screen.getByTestId('checkbox-field')).toBeInTheDocument();
  });

  it('handles change events', () => {
    const changeHandler = jest.fn();
    renderComponent([
      {
        name: 'first_name', type: 'text', label: 'First Name', value: 'John',
      },
    ], { changeHandler });

    const newValue = 'new value';
    const textField = screen.getByLabelText('First Name');
    fireEvent.change(textField, { target: { value: newValue } });
    store.getState().profilePage.account.extendedProfile[0].fieldValue = newValue;
    expect(changeHandler).toHaveBeenCalledWith('test-form', store.getState().profilePage.account.extendedProfile);
  });

  it('handles form submission', () => {
    const submitHandler = jest.fn();
    renderComponent([
      {
        name: 'first_name', type: 'text', label: 'First Name', value: 'John',
      },
    ], { submitHandler });

    const form = screen.getByTestId('test-form');
    fireEvent.submit(form);
    expect(submitHandler).toHaveBeenCalledTimes(1);
  });
});
