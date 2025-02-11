import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';

// Mock Data
import mockData from '../data/mock_data';

// Components
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';
import SelectField from './elements/SelectField';
import { editableFormSelector } from '../data/selectors';
import TextField from './elements/TextField';

const ExtendedProfileFields = (props) => {
  const {
    extendedProfileFields, formId, changeHandler, submitHandler, closeHandler, openHandler, editMode,
  } = props;

  //   if (!learningGoal) {
  //     learningGoal = mockData.learningGoal;
  //   }

  //   if (!editMode || editMode === 'empty') { // editMode defaults to 'empty', not sure why yet
  //     editMode = mockData.editMode;
  //   }

  //   if (!visibilityLearningGoal) {
  //     visibilityLearningGoal = mockData.visibilityLearningGoal;
  //   }

  return extendedProfileFields?.map((field) => (
    <SwitchContent
      className="mb-5"
      expression={field.type}
      cases={{
        checkbox: (
          <>
            <EditableItemHeader content={field.label} />
            <p data-hj-suppress className="lead">
              {field.default}
            </p>
          </>
        ),
        text: (
          <TextField
            formId={formId}
            changeHandler={changeHandler}
            submitHandler={submitHandler}
            closeHandler={closeHandler}
            openHandler={openHandler}
            editMode={editMode}
            {...field}
          />
        ),
        select: (
          <SelectField
            formId={formId}
            changeHandler={changeHandler}
            submitHandler={submitHandler}
            closeHandler={closeHandler}
            openHandler={openHandler}
            editMode={editMode}
            {...field}
          />
        ),
      }}
    />
  ));
};

ExtendedProfileFields.propTypes = {
  // From Selector
  formId: PropTypes.string.isRequired,
  extendedProfileFields: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    default: PropTypes.unknown,
    placeholder: PropTypes.string,
    instructions: PropTypes.string,
    options: PropTypes.arrayOf(PropTypes.shape({
      value: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })),
    error_message: PropTypes.shape({
      required: PropTypes.string,
      invalid: PropTypes.string,
    }),
    restrictions: PropTypes.shape({
      max_length: PropTypes.number,
    }),
    type: PropTypes.string.isRequired,
  })).isRequired,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

ExtendedProfileFields.defaultProps = {
};

export default connect(editableFormSelector, {})(injectIntl(ExtendedProfileFields));
