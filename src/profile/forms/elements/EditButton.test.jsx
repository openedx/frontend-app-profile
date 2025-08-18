import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import EditButton from './EditButton';

const messages = {
  'profile.editbutton.edit': 'Edit',
};

describe('EditButton', () => {
  it('renders and calls onClick when clicked', () => {
    const onClick = jest.fn();
    const { getByRole } = render(
      <IntlProvider locale="en" messages={messages}>
        <EditButton onClick={onClick} />
      </IntlProvider>,
    );
    const button = getByRole('button');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
