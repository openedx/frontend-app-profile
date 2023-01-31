import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';

import messages from './LearningGoal.messages';

// Components
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';

// Constants
import { LEARNING_GOALS } from '../data/constants';

const LearningGoal = (props) => {
  const { learningGoal } = useState(props.learningGoal);
  const { formId } = useState(props.formId);
  const { visibilityLearningGoal } = useState(props.visibilityLearningGoal);
  const { editMode } = useState(props.editMode);
  const { saveState } = useState(props.saveState);
  const { error } = useState(props.error);
  const { intl } = useState(props.intl)

  return (
    <SwitchContent
      className="mb-5"
      expression={editMode}
      cases={{
        static: (
          <>
            <EditableItemHeader 
              content={intl.formatMessage(messages['profile.learningGoal.learningGoal'])}
              showVisibility={visibilityLearningGoal !== null}
              visibility={visibilityLearningGoal}
            />
            <p data-hj-suppress className="h5">
              {intl.formatMessage(get(
                messages,
                `profile.learningGoal.${learningGoal}`,
                messages['profile.learningGoal.options.s']
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
  editMode: PropTypes.oneOf(['empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  openHandler: PropTypes.func.isRequired,
};

LearningGoal.defaultProps = {
  editMode: 'static',
  saveState: null,
  learningGoal: null,
  visibilityLearningGoal: 'private',
  error: null,
}

export default LearningGoal;
