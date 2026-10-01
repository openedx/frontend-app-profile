import React from 'react';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { IntlProvider } from '@openedx/frontend-base';
import EditButton from '@src/profile/forms/elements/EditButton';

const messages = {
  'profile.editbutton.edit': 'Edit',
};

describe('EditButton', () => {
  it('renders and calls onClick when clicked', async () => {
    const user = userEvent.setup();

    const onClick = jest.fn();
    const { getByRole } = render(
      <IntlProvider locale="en" messages={messages}>
        <EditButton onClick={onClick} />
      </IntlProvider>,
    );
    const button = getByRole('button');
    await user.click(button);
    expect(onClick).toHaveBeenCalled();
  });
});
