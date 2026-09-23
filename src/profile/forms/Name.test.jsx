import { screen } from '@testing-library/react';
import { mergeSiteConfig, setSiteConfig } from '@openedx/frontend-base';
import siteConfig from 'site.config';

import { accountRole } from '@src/constants';
import { renderWithForm } from '@src/profile/test/renderWithForm';
import { getAccountSettingsRoute } from '@src/utils';
import Name from './Name';

jest.mock('@src/profile/data/api');

const props = {
  formId: 'name',
  name: 'Lemon Seltzer',
  visibilityName: 'private',
  changeHandler: jest.fn(),
  submitHandler: jest.fn(),
  closeHandler: jest.fn(),
  openHandler: jest.fn(),
};

// The link to account settings only shows while the field is open for editing.
const renderOpenForm = () => renderWithForm(
  <Name {...props} accountSettings={getAccountSettingsRoute()} />,
  { form: { currentlyEditingField: 'name' } },
);

const getLink = () => screen.getByRole('link', { name: /Edit full name from the Accounts page/ });

beforeEach(() => setSiteConfig(siteConfig));

describe('Name', () => {
  it('sends the learner to the LMS in a new tab when no app owns the account route', () => {
    renderOpenForm();

    expect(getLink()).toHaveAttribute('href', 'http://localhost:18000/account/settings');
    expect(getLink()).toHaveAttribute('target', '_blank');
  });

  it('navigates in the client when the account app is installed alongside', () => {
    mergeSiteConfig({
      apps: [{
        appId: 'org.openedx.frontend.app.accountTest',
        routes: [{ path: 'account', handle: { roles: [accountRole] } }],
      }],
    });
    renderOpenForm();

    expect(getLink()).toHaveAttribute('href', '/account');
    expect(getLink()).not.toHaveAttribute('target', '_blank');
  });
});
