import { useEffect, useState } from 'react';
import { useIntl } from '@edx/frontend-platform/i18n';
import { FORM_MODE } from '../constants';
import messages from '../messages';

const useFieldController = ({
  name: fieldName, value: fieldValue, errorMessages, formEditMode, activeFieldName, fieldRestrictions,
}) => {
  const { formatMessage } = useIntl();
  const [draftValue, setDraftValue] = useState(fieldValue);
  const [fieldError, setFieldError] = useState(null);

  useEffect(() => {
    if (draftValue === '') {
      setFieldError(errorMessages.required);
    } else if (fieldRestrictions?.min_length && draftValue?.length < fieldRestrictions.min_length) {
      setFieldError(errorMessages?.min_length
            ?? formatMessage(messages['profile.formcontrols.error.min_length'], { minLength: fieldRestrictions.min_length }));
    } else if (fieldRestrictions?.max_length && draftValue?.length > fieldRestrictions.max_length) {
      setFieldError(errorMessages?.max_length
            ?? formatMessage(messages['profile.formcontrols.error.max_length'], { maxLength: fieldRestrictions.min_length }));
    } else {
      setFieldError(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [draftValue?.length]);

  const isFieldBeingEdited = formEditMode === FORM_MODE.EDITING && activeFieldName === fieldName;
  const isFieldEmpty = draftValue === '' || !draftValue;

  const getFieldDisplayMode = () => {
    if (isFieldBeingEdited) {
      return FORM_MODE.EDITING;
    }
    if (isFieldEmpty) {
      return FORM_MODE.EMPTY;
    }
    return FORM_MODE.EDITABLE;
  };

  return {
    draftValue,
    setDraftValue,
    fieldError,
    getFieldDisplayMode,
  };
};

export default useFieldController;
