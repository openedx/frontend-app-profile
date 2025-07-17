import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import FormControls from './FormControls';
import messages from './FormControls.messages';

describe('FormControls', () => {
  it('renders and triggers cancelHandler', () => {
    const cancelHandler = jest.fn();
    const changeHandler = jest.fn();
    const { getByText } = render(
      <IntlProvider locale="en" messages={messages}>
        <FormControls
          cancelHandler={cancelHandler}
          changeHandler={changeHandler}
          visibilityId="test-visibility"
        />
      </IntlProvider>,
    );
    // Use the actual label from the messages file
    const cancelLabel = messages['profile.formcontrols.button.cancel'].defaultMessage;
    fireEvent.click(getByText(cancelLabel));
    expect(cancelHandler).toHaveBeenCalled();
  });
});
