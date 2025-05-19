import { Button, Form, StatefulButton } from '@openedx/paragon';
import { useIntl } from '@edx/frontend-platform/i18n';
import PropTypes from 'prop-types';

import SwitchContent from '../../../forms/elements/SwitchContent';
import EmptyContent from '../../../forms/elements/EmptyContent';
import EditableItemHeader from '../../../forms/elements/EditableItemHeader';

import messages from '../../messages';
import { FORM_MODE } from '../../constants';

import useFieldController from '../useFieldController';

const BaseField = ({
  name: fieldName,
  value: fieldValue,
  placeholder: fieldPlaceholder,
  instructions: fieldInstructions,
  label: fieldLabel,
  required: isRequired,
  restrictions: fieldRestrictions,
  errorMessages,
  formEditMode,
  activeFieldName,
  setFormMode,
  handleFormSubmit,
  saveState,
  options: fieldOptions,
  renderEditingField,
  renderEditableField,
  renderEmptyField,
}) => {
  const { formatMessage } = useIntl();

  const {
    draftValue,
    setDraftValue,
    fieldError,
    getFieldDisplayMode,
  } = useFieldController({
    name: fieldName,
    value: fieldValue,
    errorMessages,
    formEditMode,
    activeFieldName,
    fieldRestrictions,
  });

  const handleStartEditing = () => {
    setFormMode(FORM_MODE.EDITING, fieldName);
  };

  const handleCancelEditing = () => {
    setFormMode(FORM_MODE.EDITABLE);
    setDraftValue(fieldValue);
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    handleFormSubmit(fieldName, draftValue);
  };

  return (
    <SwitchContent
      expression={getFieldDisplayMode()}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${fieldName}-label`}>
            <form data-testid="field-form" onSubmit={onSubmit}>
              <Form.Group
                controlId={fieldName}
                isInvalid={fieldError}
              >

                {renderEditingField({
                  fieldName,
                  fieldLabel,
                  fieldError,
                  draftValue,
                  setDraftValue,
                  fieldRestrictions,
                  isRequired,
                  fieldOptions,
                })}

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
        editable: renderEditableField({
          fieldLabel, fieldName, draftValue, handleStartEditing,
        }),
        empty: renderEmptyField?.({
          fieldName,
          fieldLabel,
          draftValue,
          fieldInstructions,
          fieldPlaceholder,
          handleStartEditing,
        }) || (
        <>
          <EditableItemHeader content={fieldLabel} />
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

BaseField.propTypes = {
  name: PropTypes.string.isRequired,
  value: PropTypes.string,
  placeholder: PropTypes.string,
  instructions: PropTypes.string,
  label: PropTypes.string,
  required: PropTypes.bool,
  restrictions: PropTypes.shape({
    max_length: PropTypes.number,
    min_length: PropTypes.number,
  }),
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
  renderEditingField: PropTypes.func.isRequired,
  renderEditableField: PropTypes.func.isRequired,
  renderEmptyField: PropTypes.func,
  options: PropTypes.arrayOf(PropTypes.shape({
    value: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  })),
};

BaseField.defaultProps = {
  value: '',
  placeholder: '',
  instructions: '',
  label: '',
  restrictions: {},
  errorMessages: {},
  formEditMode: FORM_MODE.STATIC,
  activeFieldName: '',
  setFormMode: () => {},
  handleFormSubmit: () => {},
  saveState: 'default',
  renderEmptyField: null,
};

export default BaseField;
