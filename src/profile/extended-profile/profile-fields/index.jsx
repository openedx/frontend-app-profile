import React, { useContext } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

import { fetchProfile } from '../../data/actions';
import SwitchContent from '../../forms/elements/SwitchContent';

import ExtendedProfileFieldsContext from '../ExtendedProfileContext';

import TextField from './elements/TextField';
import CheckboxField from './elements/CheckboxField';
import SelectField from './elements/SelectField';

const ProfileFields = () => {
  const dispatch = useDispatch();

  const extendedProfileValues = useSelector((state) => state.profilePage.account.extendedProfile);

  const {
    extendedProfileFields,
    editMode: formEditMode,
    editingInput: activeFieldName,
    handleChangeFormMode: setFormMode,
    handleSaveExtendedProfile: saveProfile,
    handleResetFormEdition,
    handleChangeSaveState,
    saveState,
  } = useContext(ExtendedProfileFieldsContext);

  const handleFormSubmit = async (fieldName, fieldValue) => {
    handleChangeSaveState('pending');
    const user = getAuthenticatedUser();
    const newFields = extendedProfileValues.map((field) => {
      if (field.fieldName === fieldName) {
        return { ...field, fieldValue };
      }
      return field;
    });

    try {
      await saveProfile(user.username, { extendedProfile: newFields });
      dispatch(fetchProfile(user.username));
    } catch (error) {
      handleChangeSaveState('error');
    } finally {
      handleChangeSaveState('complete');
      handleResetFormEdition();
    }
  };
  return (
    <div>
      {extendedProfileFields?.map((field) => {
        // extendedProfileValues comes from the user profile values
        // here we are looking for the field value of each extended profile field
        const value = extendedProfileValues.find((el) => el.fieldName === field.name)?.fieldValue;

        const commonProps = {
          ...field,
          value,
          formEditMode,
          activeFieldName,
          setFormMode,
          handleFormSubmit,
          saveState,
        };

        return (
          <SwitchContent
            className="mb-5"
            expression={field.type}
            cases={{
              checkbox: <CheckboxField {...commonProps} />,
              text: <TextField {...commonProps} />,
              select: <SelectField {...commonProps} />,
            }}
          />
        );
      })}
    </div>
  );
};

export default ProfileFields;
