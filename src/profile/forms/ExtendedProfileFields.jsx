import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { connect, useSelector } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

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

  const draftProfile = useSelector((state) => state.profilePage.drafts);
  const extendedProfile = useSelector((state) => state.profilePage.account.extendedProfile);
  const visibilityExtendedProfile = useSelector((state) => state.profilePage.preferences.visibilityExtendedProfile);
  const [currentEditingField, setCurrentEditingField] = useState(null);

  const handleOpenEdit = (form) => {
    const [parentFormId, fieldId] = form.split('/');

    openHandler(parentFormId);
    setCurrentEditingField(fieldId);
  };

  const handleCloseEdit = () => {
    closeHandler(null);
    setCurrentEditingField(null);
  };

  const handleChangeExtendedField = (name, value) => {
    const [parentFormId, fieldName] = name.split('/');
    if (name.includes('visibility')) {
      changeHandler(parentFormId, { [fieldName]: value });
    } else {
      const fieldIndex = extendedProfile.findIndex((field) => field.fieldName === fieldName);
      const newFields = extendedProfile.map(
        (extendedField, index) => (index === fieldIndex ? { ...extendedField, fieldValue: value } : extendedField),
      );
      changeHandler(parentFormId, newFields);
    }
  };

  const handleSubmitExtendedField = (form) => {
    const [parentFormId] = form.split('/');
    submitHandler(parentFormId);
    setCurrentEditingField(null);
  };

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
            formId={`${formId}/${field.name}`}
            editMode={currentEditingField === field.name ? editMode : 'editable'}
            changeHandler={handleChangeExtendedField}
            submitHandler={handleSubmitExtendedField}
            closeHandler={handleCloseEdit}
            openHandler={handleOpenEdit}
            {...field}
          />
        ),
        select: (
          <SelectField
            formId={`${formId}/${field.name}`}
            editMode={currentEditingField === field.name ? editMode : 'editable'}
            changeHandler={handleChangeExtendedField}
            submitHandler={handleSubmitExtendedField}
            closeHandler={handleCloseEdit}
            openHandler={handleOpenEdit}
            {...field}
            value={draftProfile?.extendedProfile?.find(
              (extendedField) => extendedField.fieldName === field.name,
            )?.fieldValue ?? field.value}
            visibility={
                draftProfile?.visibilityExtendedProfile?.[field.name] ?? visibilityExtendedProfile?.[field.name]
            }
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
