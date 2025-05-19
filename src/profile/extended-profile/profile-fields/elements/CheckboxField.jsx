import { Form } from '@openedx/paragon';
import DOMPurify from 'dompurify';

import EditableItemHeader from '../../../forms/elements/EditableItemHeader';
import EmptyContent from '../../../forms/elements/EmptyContent';

import BaseField from './BaseField';

const CheckboxField = (props) => (
  <BaseField
    {...props}
    renderEditingField={({
      fieldName,
      fieldLabel,
      fieldError,
      draftValue,
      setDraftValue,
    }) => (
      <>
        <Form.Checkbox
          id={fieldName}
          name={fieldName}
          checked={draftValue}
          onChange={(event) => setDraftValue(event.target.checked)}
        >
          {/* eslint-disable-next-line react/no-danger */}
          <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fieldLabel) }} />
        </Form.Checkbox>
        {fieldError !== null && (
        <Form.Control.Feedback hasIcon={false}>
          {fieldError}
        </Form.Control.Feedback>
        )}
      </>
    )}
    renderEditableField={({
      fieldLabel, fieldName, handleStartEditing, draftValue,
    }) => (
      <EditableItemHeader
        content={(
          <Form.Checkbox
            id={fieldName}
            name={fieldName}
            checked={draftValue}
          >
            {/* eslint-disable-next-line react/no-danger */}
            <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(fieldLabel) }} />
          </Form.Checkbox>
          )}
        showEditButton
        onClickEdit={handleStartEditing}
        showVisibility={false}
        visibility="private"
      />
    )}
    renderEmptyField={({
      fieldName,
      fieldLabel,
      draftValue,
      fieldInstructions,
      fieldPlaceholder,
      handleStartEditing,
    }) => (
      <>
        <EditableItemHeader content={(
          <Form.Checkbox
            id={fieldName}
            name={fieldName}
            checked={draftValue}
          >
            {/* eslint-disable-next-line react/no-danger */}
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
    )}
  />
);

CheckboxField.propTypes = {
  ...BaseField.propTypes,
};

export default CheckboxField;
