// It is disabled this way because the content is sanitized before being injected into the DOM.
/* eslint-disable react/no-danger */

import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import { Button, Form, StatefulButton } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import DOMPurify from 'dompurify';

import SwitchContent from '../../../forms/elements/SwitchContent';
import EmptyContent from '../../../forms/elements/EmptyContent';
import EditableItemHeader from '../../../forms/elements/EditableItemHeader';
import messages from '../../messages';

const CheckboxField = (props) => {
  const {
    name: fieldName,
    value: fieldValue,
    placeholder: fieldPlaceholder,
    instructions: fieldInstructions,
    label: fieldLabel,
    restrictions: fieldRestrictions,
    errorMessages,
    formEditMode,
    activeFieldName,
    setFormMode,
    handleFormSubmit,
    saveState,
  } = props;

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

  const handleStartEditing = () => {
    setFormMode('editing', fieldName);
  };

  const handleCancelEditing = () => {
    setFormMode('editable');
    setDraftValue(fieldValue);
  };

  const handleFieldChange = (event) => {
    setDraftValue(event.target.checked);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    handleFormSubmit(fieldName, draftValue);
  };

  const isFieldBeingEdited = formEditMode === 'editing' && activeFieldName === fieldName;
  const isFieldEmpty = draftValue === '' || !draftValue;

  const getFieldDisplayMode = () => {
    if (isFieldBeingEdited) {
      return 'editing';
    }
    if (isFieldEmpty) {
      return 'empty';
    }
    return 'editable';
  };

  return (
    <SwitchContent
      expression={getFieldDisplayMode()}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${fieldName}-label`}>
            <form data-testid="test-form" onSubmit={onSubmit}>
              <Form.Group
                controlId={fieldName}
                isInvalid={fieldError}
              >
                <Form.Checkbox
                  id={fieldName}
                  name={fieldName}
                  checked={draftValue}
                  onChange={handleFieldChange}
                >
                  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fieldLabel) }} />
                </Form.Checkbox>
                {fieldError !== null && (
                <Form.Control.Feedback hasIcon={false}>
                  {fieldError}
                </Form.Control.Feedback>
                )}
              </Form.Group>

              <div className="form-group flex-shrink-0 flex-grow-1">
                <StatefulButton
                  type="submit"
                  state={saveState}
                  labels={{
                    default: formatMessage(messages['profile.formcontrols.button.save']),
                    pending: formatMessage(messages['profile.formcontrols.button.saving']),
                    complete: formatMessage(messages['profile.formcontrols.button.saved']),
                  }}
                  onClick={(e) => {
                    // Swallow clicks if the state is pending.
                    // We do this instead of disabling the button to prevent
                    // it from losing focus (disabled elements cannot have focus).
                    // Disabling it would causes upstream issues in focus management.
                    // Swallowing the onSubmit event on the form would be better, but
                    // we would have to add that logic for every field given our
                    // current structure of the application.
                    if (saveState === 'pending') {
                      e.preventDefault();
                    }
                  }}
                  disabled={!!fieldError}
                />
                <Button variant="link" onClick={handleCancelEditing}>
                  {formatMessage(messages['profile.formcontrols.button.cancel'])}
                </Button>
              </div>
            </form>
          </div>
        ),
        editable: (
          <EditableItemHeader
            content={(
              <Form.Checkbox
                id={fieldName}
                name={fieldName}
                checked={draftValue}
              >
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fieldLabel) }} />
              </Form.Checkbox>
              )}
            showEditButton
            onClickEdit={handleStartEditing}
            showVisibility={false}
            visibility="private"
          />
        ),
        empty: (
          <>
            <EditableItemHeader content={(
              <Form.Checkbox
                id={fieldName}
                name={fieldName}
                checked={draftValue}
              >
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fieldLabel) }} />
              </Form.Checkbox>
              )}
            />
            <EmptyContent onClick={handleStartEditing}>
              {fieldInstructions}
            </EmptyContent>
            <small className="form-text text-muted">
              {fieldPlaceholder}
            </small>
          </>
        ),
        static: draftValue && (
          <>
            <EditableItemHeader content={fieldLabel} />
            <p data-hj-suppress className="h5">{draftValue}</p>
          </>
        ),
      }}
    />
  );
};

CheckboxField.propTypes = {
  name: PropTypes.string,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  instructions: PropTypes.string,
  label: PropTypes.string,
  // https://github.com/openedx/edx-platform/blob/master/openedx/core/djangoapps/user_api/helpers.py#L151
  required: PropTypes.bool,
  // https://github.com/openedx/edx-platform/blob/master/openedx/core/djangoapps/user_api/helpers.py#L167
  restrictions: PropTypes.shape({
    max_length: PropTypes.number,
    min_length: PropTypes.number,
  }),
  // https://github.com/openedx/edx-platform/blob/master/openedx/core/djangoapps/user_api/helpers.py#L179
  errorMessages: PropTypes.shape({
    required: PropTypes.string,
    max_length: PropTypes.string,
    min_length: PropTypes.string,
  }),
  formEditMode: PropTypes.string,
  activeFieldName: PropTypes.string,
  setFormMode: PropTypes.func,
  handleFormSubmit: PropTypes.func,
  saveState: PropTypes.oneOf(['default', 'error', 'pending', 'complete']),
};

export default CheckboxField;
