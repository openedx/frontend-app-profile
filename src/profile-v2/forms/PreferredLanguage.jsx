import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import messages from './PreferredLanguage.messages';

import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

import { preferredLanguageSelector } from '../data/selectors';
import {
  useCloseOpenHandler,
  useHandleSubmit,
  useIsVisibilityEnabled,
} from '../data/hooks';

const PreferredLanguage = ({
  formId,
  languageProficiencies,
  visibilityLanguageProficiencies,
  editMode,
  saveState,
  error,
  sortedLanguages,
  languageMessages,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
  const isVisibilityEnabled = useIsVisibilityEnabled();
  const intl = useIntl();

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
                <p data-hj-suppress className="field-headings font-weight-bold m-0 pb-2.5">
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
                  <option value=""> </option>
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
            <p data-hj-suppress className="field-headings font-weight-bold m-0 pb-1.5">
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
            <p data-hj-suppress className="field-headings font-weight-bold m-0 pb-1.5">
              {intl.formatMessage(messages['profile.preferredlanguage.label'])}
            </p>
            <EmptyContent onClick={handleOpen}>
              {intl.formatMessage(messages['profile.preferredlanguage.empty'])}
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <p data-hj-suppress className="field-headings font-weight-bold m-0 pb-1.5">
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
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  sortedLanguages: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  languageMessages: PropTypes.objectOf(PropTypes.string).isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

PreferredLanguage.defaultProps = {
  editMode: 'static',
  saveState: null,
  languageProficiencies: [],
  visibilityLanguageProficiencies: 'private',
  error: null,
};

export default connect(
  preferredLanguageSelector,
  {},
)(PreferredLanguage);
