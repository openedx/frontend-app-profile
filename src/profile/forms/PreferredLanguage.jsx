import React from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@openedx/frontend-base';
import { Form } from '@openedx/paragon';

import messages from '@src/profile/forms/PreferredLanguage.messages';

import FormControls from '@src/profile/forms/elements/FormControls';
import EditableItemHeader from '@src/profile/forms/elements/EditableItemHeader';
import EmptyContent from '@src/profile/forms/elements/EmptyContent';
import SwitchContent from '@src/profile/forms/elements/SwitchContent';

import {
  useCloseOpenHandler,
  useEditableForm,
  useHandleSubmit,
  useLanguageOptions,
  useIsVisibilityEnabled,
} from '@src/profile/data/hooks';

const PreferredLanguage = ({
  formId,
  languageProficiencies,
  visibilityLanguageProficiencies,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
  const isVisibilityEnabled = useIsVisibilityEnabled();
  const intl = useIntl();
  const { editMode, error, saveState } = useEditableForm(formId);
  const { sortedLanguages, languageMessages } = useLanguageOptions();

  const handleChange = ({ target: { name, value } }) => {
    let newValue = value;
    if (name === formId) {
      newValue = value ? [{ code: value }] : [];
    }
    changeHandler(name, newValue);
  };

  const handleSubmit = useHandleSubmit(submitHandler, formId);
  const handleOpen = useCloseOpenHandler(openHandler, formId);
  const handleClose = useCloseOpenHandler(closeHandler, formId);

  const value = languageProficiencies.length ? languageProficiencies[0].code : '';

  return (
    <SwitchContent
      className="pt-40px"
      expression={editMode}
      cases={{
        editing: (
          <div role="dialog" aria-labelledby={`${formId}-label`}>
            <form onSubmit={handleSubmit}>
              <Form.Group
                controlId={formId}
                className="m-0 pb-3"
                isInvalid={error !== null}
              >
                <p data-hj-suppress className="h5 font-weight-bold m-0 pb-2.5">
                  {intl.formatMessage(messages['profile.preferredlanguage.label'])}
                </p>
                <select
                  data-hj-suppress
                  id={formId}
                  name={formId}
                  className="form-control py-10px"
                  value={value}
                  onChange={handleChange}
                >
                  <option value="" aria-label="empty">&nbsp;</option>
                  {sortedLanguages.map(({ code, name }) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </select>
                {error !== null && (
                  <Form.Control.Feedback hasIcon={false}>
                    {error}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <FormControls
                visibilityId="visibilityLanguageProficiencies"
                saveState={saveState}
                visibility={visibilityLanguageProficiencies}
                cancelHandler={handleClose}
                changeHandler={handleChange}
              />
            </form>
          </div>
        ),
        editable: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
              {intl.formatMessage(messages['profile.preferredlanguage.label'])}
            </p>
            <EditableItemHeader
              content={languageMessages[value]}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityLanguageProficiencies !== null && isVisibilityEnabled}
              visibility={visibilityLanguageProficiencies}
            />
          </>
        ),
        empty: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
              {intl.formatMessage(messages['profile.preferredlanguage.label'])}
            </p>
            <EmptyContent onClick={handleOpen}>
              {intl.formatMessage(messages['profile.preferredlanguage.empty'])}
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
              {intl.formatMessage(messages['profile.preferredlanguage.label'])}
            </p>
            <EditableItemHeader content={languageMessages[value]} />
          </>
        ),
      }}
    />
  );
};

PreferredLanguage.propTypes = {
  formId: PropTypes.string.isRequired,
  languageProficiencies: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string })),
    PropTypes.oneOf(['']),
  ]),
  visibilityLanguageProficiencies: PropTypes.oneOf(['private', 'all_users']),
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

PreferredLanguage.defaultProps = {
  languageProficiencies: [],
  visibilityLanguageProficiencies: 'private',
};

export default PreferredLanguage;
