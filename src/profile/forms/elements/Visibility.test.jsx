import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import { Visibility, VisibilitySelect } from './Visibility';
import '@testing-library/jest-dom';

const messages = {
  'profile.visibility.who.just.me': 'Just me',
  'profile.visibility.who.everyone': 'Everyone',
};

describe('Visibility', () => {
  it('shows the correct icon and label for private', () => {
    const { getByText } = render(
      <IntlProvider locale="en" messages={messages}>
        <Visibility to="private" />
      </IntlProvider>,
    );
    expect(getByText(/just me/i)).toBeInTheDocument();
  });
  it('shows the correct icon and label for all_users', () => {
    const { getByText } = render(
      <IntlProvider locale="en" messages={messages}>
        <Visibility to="all_users" />
      </IntlProvider>,
    );
    expect(getByText(/everyone/i)).toBeInTheDocument();
  });
});

describe('VisibilitySelect', () => {
  it('renders both options', () => {
    const { getByRole, getAllByRole } = render(
      <IntlProvider locale="en" messages={messages}>
        <VisibilitySelect value="private" onChange={() => {}} />
      </IntlProvider>,
    );
    const select = getByRole('combobox');
    const options = getAllByRole('option');
    expect(select).toBeInTheDocument();
    expect(options.length).toBe(2);
  });
});
