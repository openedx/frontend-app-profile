import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { intlShape } from '@edx/frontend-platform/i18n';

// Components
import SwitchContent from './elements/SwitchContent';
import SelectField from './elements/SelectField';
import TextField from './elements/TextField';
import CheckboxField from './elements/CheckboxField';
import { moveCheckboxFieldsToEnd } from '../utils';

const ExtendedProfileFields = (props) => {
  const {
    extendedProfileFields, formId, changeHandler, submitHandler, closeHandler, openHandler,
  } = props;

  const draftProfile = useSelector((state) => state.profilePage.drafts);
  const extendedProfile = useSelector((state) => state.profilePage.account.extendedProfile);
  const visibilityExtendedProfile = useSelector((state) => state.profilePage.preferences.visibilityExtendedProfile);

  const handleChangeExtendedField = (name, value) => {
    const [parentPropKey, fieldName] = name.split('/');
    const isVisibilityChange = name.includes('visibility');
    const fields = isVisibilityChange ? visibilityExtendedProfile : extendedProfile;
    const newFields = isVisibilityChange
      ? {
        ...fields,
        [fieldName]: value,
      }
      : fields.map(
        (extendedField) => (
          extendedField.fieldName === fieldName ? { ...extendedField, fieldValue: value } : extendedField
        ),
      );
    changeHandler(parentPropKey, newFields);
  };

  const handleSubmitExtendedField = (form) => {
    submitHandler(form);
  };

  return (
    <div>
      {extendedProfileFields.sort(moveCheckboxFieldsToEnd)?.map((field) => {
        const value = draftProfile?.extendedProfile?.find(
          (extendedField) => extendedField.fieldName === field.name,
        )?.fieldValue ?? field.value;

        const visibility = draftProfile?.visibilityExtendedProfile?.[field.name]
            ?? visibilityExtendedProfile?.[field.name];

        const commonProps = {
          ...field,
          formId: `${formId}/${field.name}`,
          changeHandler: handleChangeExtendedField,
          submitHandler: handleSubmitExtendedField,
          closeHandler,
          openHandler,
          value,
          visibility,
        };

        return (
          <SwitchContent
            className="mb-5"
            expression={field.type}
            cases={{
              checkbox: (
                <CheckboxField {...commonProps} />
              ),
              text: (
                <TextField {...commonProps} />
              ),
              select: (
                <SelectField {...commonProps} />
              ),
            }}
          />
        );
      })}
    </div>
  );
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

  // Props
  isAuthenticatedUserProfile: PropTypes.bool.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

ExtendedProfileFields.defaultProps = {
};

export default ExtendedProfileFields;
