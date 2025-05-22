import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import { getConfig } from '@edx/frontend-platform';
import messages from './Country.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { countrySelector } from '../data/selectors';

const Country = ({
  formId,
  country,
  visibilityCountry,
  editMode,
  saveState,
  error,
  translatedCountries,
  countriesCodesList,
  countryMessages,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
}) => {
  const isVisibilityEnabled = getConfig().DISABLE_VISIBILITY_EDITING === 'true';
  const intl = useIntl();

  const handleChange = (e) => {
    const { name, value } = e.target;
    changeHandler(name, value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitHandler(formId);
  };

  const handleClose = () => {
    closeHandler(formId);
  };

  const handleOpen = () => {
    openHandler(formId);
  };

  const isDisabledCountry = (countryCode) => countriesCodesList.length > 0
      && !countriesCodesList.find(code => code === countryCode);

  return (
    <SwitchContent
      className="pt-25rem"
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
                <p data-hj-suppress className="h5 font-weight-bold m-0 pb-075rem">
                  {intl.formatMessage(messages['profile.country.label'])}
                </p>
                <select
                  data-hj-suppress
                  className="form-control py-0625rem"
                  type="select"
                  id={formId}
                  name={formId}
                  value={country}
                  onChange={handleChange}
                >
                  <option value=""> </option>
                  {translatedCountries.map(({ code, name }) => (
                    <option key={code} value={code} disabled={isDisabledCountry(code)}>
                      {name}
                    </option>
                  ))}
                </select>
                {error !== null && (
                  <Form.Control.Feedback hasIcon={false}>
                    {error}
                  </Form.Control.Feedback>
                )}
              </Form.Group>
              <FormControls
                visibilityId="visibilityCountry"
                saveState={saveState}
                visibility={visibilityCountry}
                cancelHandler={handleClose}
                changeHandler={handleChange}
              />
            </form>
          </div>
        ),
        editable: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-0375rem">
              {intl.formatMessage(messages['profile.country.label'])}
            </p>
            <EditableItemHeader
              content={countryMessages[country]}
              showEditButton
              onClickEdit={handleOpen}
              showVisibility={visibilityCountry !== null && isVisibilityEnabled}
              visibility={visibilityCountry}
            />
          </>
        ),
        empty: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-0375rem">
              {intl.formatMessage(messages['profile.country.label'])}
            </p>
            <EmptyContent onClick={handleOpen}>
              {intl.formatMessage(messages['profile.country.empty'])}
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-0375rem">
              {intl.formatMessage(messages['profile.country.label'])}
            </p>
            <EditableItemHeader content={countryMessages[country]} />
          </>
        ),
      }}
    />
  );
};

Country.propTypes = {
  formId: PropTypes.string.isRequired,
  country: PropTypes.string,
  visibilityCountry: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,
  translatedCountries: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  countriesCodesList: PropTypes.arrayOf(PropTypes.string).isRequired,
  countryMessages: PropTypes.objectOf(PropTypes.string).isRequired,
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

Country.defaultProps = {
  editMode: 'static',
  saveState: null,
  country: null,
  visibilityCountry: 'private',
  error: null,
};

export default connect(
  countrySelector,
  {},
)(Country);
