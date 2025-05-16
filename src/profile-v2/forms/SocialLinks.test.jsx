import { render, fireEvent, screen } from '@testing-library/react';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { configure as configureI18n, IntlProvider } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';

import SocialLinks from './SocialLinks';
import * as savingEditedBio from '../__mocks__/savingEditedBio.mockStore';
import messages from '../../i18n';

const mockStore = configureMockStore([thunk]);

const defaultProps = {
  formId: 'socialLinks',
  socialLinks: [
    {
      platform: 'facebook',
      socialLink: 'https://www.facebook.com/aloha',
    },
    {
      platform: 'twitter',
      socialLink: 'https://www.twitter.com/ALOHA',
    },
  ],
  drafts: {},
  visibilitySocialLinks: 'private',
  editMode: 'static',
  saveState: null,
  error: null,
  changeHandler: jest.fn(),
  submitHandler: jest.fn(),
  closeHandler: jest.fn(),
  openHandler: jest.fn(),
};

configureI18n({
  loggingService: { logError: jest.fn() },
  config: {
    ENVIRONMENT: 'production',
    LANGUAGE_PREFERENCE_COOKIE_NAME: 'yum',
  },
  messages,
});

const SocialLinksWrapper = (props) => {
  const contextValue = useMemo(() => ({
    authenticatedUser: { userId: null, username: null, administrator: false },
    config: getConfig(),
  }), []);
  return (
    <AppContext.Provider
      value={contextValue}
    >
      <IntlProvider locale="en">
        <Provider store={props.store}>
          <SocialLinks {...props} />
        </Provider>
      </IntlProvider>
    </AppContext.Provider>
  );
};

SocialLinksWrapper.defaultProps = {
  store: mockStore(savingEditedBio),
};

SocialLinksWrapper.propTypes = {
  store: PropTypes.shape({}),
};

const SocialLinksWrapperWithStore = ({ store }) => {
  const contextValue = useMemo(() => ({
    authenticatedUser: { userId: null, username: null, administrator: false },
    config: getConfig(),
  }), []);
  return (
    <AppContext.Provider
      value={contextValue}
    >
      <IntlProvider locale="en">
        <Provider store={mockStore(store)}>
          <SocialLinks {...defaultProps} formId="bio" />
        </Provider>
      </IntlProvider>
    </AppContext.Provider>
  );
};

SocialLinksWrapperWithStore.defaultProps = {
  store: mockStore(savingEditedBio),
};

SocialLinksWrapperWithStore.propTypes = {
  store: PropTypes.shape({}),
};

describe('<SocialLinks />', () => {
  ['certificates', 'bio', 'goals', 'socialLinks'].forEach(editMode => (
    it(`calls social links with edit mode ${editMode}`, () => {
      const component = <SocialLinksWrapper {...defaultProps} formId={editMode} />;
      const { container: tree } = render(component);
      expect(tree).toMatchSnapshot();
    })
  ));

  it('calls social links with editing', () => {
    const changeHandler = jest.fn();
    const submitHandler = jest.fn();
    const closeHandler = jest.fn();
    const { container } = render(
      <SocialLinksWrapper
        {...defaultProps}
        formId="bio"
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        closeHandler={closeHandler}
      />,
    );

    const { platform } = defaultProps.socialLinks[0];
    const inputField = container.querySelector(`#social-${platform}`);
    fireEvent.change(inputField, { target: { value: 'test', name: platform } });
    expect(changeHandler).toHaveBeenCalledTimes(1);

    const selectElement = container.querySelector('#visibilitySocialLinks');
    expect(selectElement.value).toBe('private');
    fireEvent.change(selectElement, { target: { value: 'all_users', name: 'visibilitySocialLinks' } });
    expect(changeHandler).toHaveBeenCalledTimes(2);

    fireEvent.submit(container.querySelector('[aria-labelledby="editing-form"]'));
    expect(submitHandler).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }));
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });

  it('calls social links with static', () => {
    const openHandler = jest.fn();
    render(
      <SocialLinksWrapper
        {...defaultProps}
        formId="goals"
        openHandler={openHandler}
      />,
    );
    const addFacebookButton = screen.getByRole('button', { name: 'Add Facebook' });
    fireEvent.click(addFacebookButton);

    expect(openHandler).toHaveBeenCalledTimes(1);
  });

  it('calls social links with error', () => {
    const newStore = JSON.parse(JSON.stringify(savingEditedBio));
    newStore.profilePage.errors.bio = { userMessage: 'error' };

    const { container } = render(<SocialLinksWrapperWithStore store={newStore} />);

    const alertDanger = container.querySelector('.alert-danger');
    expect(alertDanger).toBeInTheDocument();
  });
});
