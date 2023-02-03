import { mount } from 'enzyme';
import PropTypes from 'prop-types';
import React, { useMemo } from 'react';
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import { configure as configureI18n, IntlProvider } from '@edx/frontend-platform/i18n';
import { getConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import messages from '../../i18n';

import viewOwnProfileMockStore from '../__mocks__/viewOwnProfile.mockStore';
import viewOtherProfileMockStore from '../__mocks__/viewOtherProfile.mockStore';
import savingEditedBioMockStore from '../__mocks__/savingEditedBio.mockStore';

import LearningGoal from './LearningGoal';
import SkillsBuilder from '../../skills/SkillsBuilder';
import { Container } from '@edx/paragon';

const mockStore = configureMockStore([thunk]);
const storeMocks = {
  viewOwnProfile: viewOwnProfileMockStore,
  viewOtherProfile: viewOtherProfileMockStore,
  savingEditedBio: savingEditedBioMockStore,
};

// props to be passed down to LearningGoal component
const requiredLearningGoalProps = {
  formId: 'learningGoal',
  learningGoal: "advance_career",
  drafts: {},
  visibilityLearningGoal: 'private',
  editMode: 'static',
  saveState: null,
  error: null,
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

beforeEach(() => {

});

const LearningGoalWrapper = (props) => {
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
          <LearningGoal {...props} />
        </Provider>
      </IntlProvider>
    </AppContext.Provider>
  );
};

LearningGoalWrapper.defaultProps = {
  store: mockStore(viewOwnProfileMockStore),
};

LearningGoalWrapper.propTypes = {
  store: PropTypes.shape({}),
};

const LearningGoalWrapperWithStore = ({ store }) => {
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
          <LearningGoal {...requiredLearningGoalProps} formId='learningGoal' />
        </Provider>
      </IntlProvider>
    </AppContext.Provider>
  );
};

LearningGoalWrapperWithStore.defaultProps = {
  store: mockStore(savingEditedBioMockStore),
};

LearningGoalWrapperWithStore.propTypes = {
  store: PropTypes.shape({}),
};

describe('<LearningGoal />', () => {
  describe('Opens Skills Builder modal', () => {
    it('renders the current learning goal', () => {
      const learningGoalRenderer = renderer.create(
        <LearningGoalWrapper
        {...requiredLearningGoalProps}
        formId="learningGoal"
        />
      );

      const learningGoalInstance = learningGoalRenderer.root;

      expect(learningGoalInstance.findByProps({className: "lead"}).children).toEqual(['I want to advance my career']);
    });
  });
});
