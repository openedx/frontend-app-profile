import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';

// Mock Data
import mockData from '../data/mock_data';

import messages from './LearningGoal.messages';

// Components
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

const LearningGoal = (props) => {
  let { learningGoal, editMode, visibilityLearningGoal } = props;
  const { intl } = props;

  if (!learningGoal) {
    learningGoal = mockData.learningGoal;
  }

  if (!editMode || editMode === 'empty') { // editMode defaults to 'empty', not sure why yet
    editMode = mockData.editMode;
  }

  if (!visibilityLearningGoal) {
    visibilityLearningGoal = mockData.visibilityLearningGoal;
  }

  return (
    <SwitchContent
      className="mb-5"
      expression={editMode}
      cases={{
        editable: (
          <>
            <EditableItemHeader
              content={intl.formatMessage(messages['profile.learningGoal.learningGoal'])}
              showVisibility={visibilityLearningGoal !== null}
              visibility={visibilityLearningGoal}
            />
            <p data-hj-suppress className="lead">
              {intl.formatMessage(get(
                messages,
                `profile.learningGoal.options.${learningGoal}`,
                messages['profile.learningGoal.options.something_else'],
              ))}
            </p>
          </>
        ),
        static: (
          <>
            <EditableItemHeader content={intl.formatMessage(messages['profile.learningGoal.learningGoal'])} />
            <p data-hj-suppress className="lead">
              {intl.formatMessage(get(
                messages,
                `profile.learningGoal.options.${learningGoal}`,
                messages['profile.learningGoal.options.something_else'],
              ))}
            </p>
          </>
        ),
      }}
    />
  );
};

LearningGoal.propTypes = {
  // From Selector
  learningGoal: PropTypes.oneOf(['advance_career', 'start_career', 'learn_something_new', 'something_else']),
  visibilityLearningGoal: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editable', 'static']),

  // i18n
  intl: intlShape.isRequired,
};

LearningGoal.defaultProps = {
  editMode: 'static',
  learningGoal: null,
  visibilityLearningGoal: 'private',
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(LearningGoal));
