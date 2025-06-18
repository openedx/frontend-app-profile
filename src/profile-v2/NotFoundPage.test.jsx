import React from 'react';
import { render } from '@testing-library/react';
import { IntlProvider } from '@edx/frontend-platform/i18n';
import NotFoundPage from './NotFoundPage';

describe('NotFoundPage Snapshot Tests', () => {
  it('renders correctly', () => {
    const { asFragment } = render(
      <IntlProvider locale="en">
        <NotFoundPage />
      </IntlProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('renders with custom props', () => {
    const { asFragment } = render(
      <IntlProvider locale="en">
        <NotFoundPage message="Custom not found message" />
      </IntlProvider>,
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
