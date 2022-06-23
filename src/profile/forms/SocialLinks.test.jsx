import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import React from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
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

const SocialLinksWrapper = props => (
  <AppContext.Provider
    value={{
      authenticatedUser: { userId: null, username: null, administrator: false },
      config: getConfig(),
    }}
  >
    <IntlProvider locale="en">
      <Provider store={props.store}>
        <SocialLinks {...props} />
      </Provider>
    </IntlProvider>
  </AppContext.Provider>
);

SocialLinksWrapper.defaultProps = {
  store: mockStore(savingEditedBio),
};

SocialLinksWrapper.propTypes = {
  store: PropTypes.shape({}),
};

describe('<SocialLinks />', () => {
  ['certificates', 'bio', 'goals', 'socialLinks'].forEach(editMode => (
    it(`calls social links with edit mode ${editMode}`, () => {
      const component = <SocialLinksWrapper {...defaultProps} formId={editMode} />;
      const tree = renderer.create(component).toJSON();
      expect(tree).toMatchSnapshot();
    })
  ));

  it('calls social links with editing', () => {
    const changeHandler = jest.fn();
    const submitHandler = jest.fn();
    const closeHandler = jest.fn();
    const component = (
      <SocialLinksWrapper
        {...defaultProps}
        formId="bio"
        changeHandler={changeHandler}
        submitHandler={submitHandler}
        closeHandler={closeHandler}
      />
    );
    const wrapper = mount(component);
    const socialLink = wrapper.find(SocialLinks);
    const { platform } = defaultProps.socialLinks[0];
    const inputField = socialLink.find(`#social-${platform}`);
    inputField.simulate('change', { target: { value: 'test', name: platform } });
    expect(changeHandler).toHaveBeenCalledTimes(1);

    expect(socialLink.find('#visibilitySocialLinks select').props().value).toBe('private');
    const event = { target: { value: 'all_users', name: 'visibilitySocialLinks' } };
    socialLink.find('#visibilitySocialLinks select').simulate('change', event);
    expect(changeHandler).toHaveBeenCalledTimes(2);

    socialLink.find('#editing-form').simulate('submit');
    expect(submitHandler).toHaveBeenCalledTimes(1);

    socialLink.find('#editing-form').find('Button .btn-link').simulate('click');
    expect(closeHandler).toHaveBeenCalledTimes(1);
  });

  it('calls social links with static', () => {
    const openHandler = jest.fn();
    const component = (
      <SocialLinksWrapper
        {...defaultProps}
        formId="goals"
        openHandler={openHandler}
      />
    );
    const wrapper = mount(component);
    const socialLink = wrapper.find(SocialLinks);

    socialLink.find('EmptyContent button').first().simulate('click');
    expect(openHandler).toHaveBeenCalledTimes(1);
  });

  it('calls social links with error', () => {
    const newStore = JSON.parse(JSON.stringify(savingEditedBio));
    newStore.profilePage.errors.bio = { userMessage: 'error' };
    const component = (
      <AppContext.Provider
        value={{
          authenticatedUser: { userId: null, username: null, administrator: false },
          config: getConfig(),
        }}
      >
        <IntlProvider locale="en">
          <Provider store={mockStore(newStore)}>
            <SocialLinks {...defaultProps} formId="bio" />
          </Provider>
        </IntlProvider>
      </AppContext.Provider>
    );
    const wrapper = mount(component);
    const socialLink = wrapper.find(SocialLinks);

    expect(socialLink.find('.alert-danger').exists()).toBe(true);
  });
});
