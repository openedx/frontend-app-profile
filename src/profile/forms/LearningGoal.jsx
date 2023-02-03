import React, { useEffect, useState } from 'react';
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
  let { learningGoal, editMode } = props;
  const { visibilityLearningGoal, intl } = props

  if (!learningGoal) {
    learningGoal = mockData.learningGoal;
  } 

  if (!editMode || editMode === 'empty') { //editMode defaults to 'empty', not sure why yet
    editMode = mockData.editMode;
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
                messages['profile.learningGoal.options.something_else']
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
                messages['profile.learningGoal.options.something_else']
              ))}
            </p>
          </>
        )
      }}
    />
  );
};

LearningGoal.propTypes = {
  formId: PropTypes.string.isRequired,

  // From Selector
  learningGoal: PropTypes.string,
  visibilityLearningGoal: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editable']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

LearningGoal.defaultProps = {
  editMode: 'static',
  saveState: null,
  learningGoal: null,
  visibilityLearningGoal: 'private',
  error: null,
}

export default connect(
  editableFormSelector,
  {},
)(injectIntl(LearningGoal));
