import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { useIntl } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import messages from './Country.messages';

import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

import { countrySelector } from '../data/selectors';
import {
  useCloseOpenHandler,
  useHandleChange,
  useHandleSubmit,
  useIsVisibilityEnabled,
} from '../data/hooks';

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
  const isVisibilityEnabled = useIsVisibilityEnabled();
  const intl = useIntl();

  const handleChange = useHandleChange(changeHandler);
  const handleSubmit = useHandleSubmit(submitHandler, formId);
  const handleOpen = useCloseOpenHandler(openHandler, formId);
  const handleClose = useCloseOpenHandler(closeHandler, formId);

  const isDisabledCountry = (countryCode) => countriesCodesList.length > 0
      && !countriesCodesList.find(code => code === countryCode);

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
                  {intl.formatMessage(messages['profile.country.label'])}
                </p>
                <select
                  data-hj-suppress
                  className="form-control py-10px"
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
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
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
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
              {intl.formatMessage(messages['profile.country.label'])}
            </p>
            <EmptyContent onClick={handleOpen}>
              {intl.formatMessage(messages['profile.country.empty'])}
            </EmptyContent>
          </>
        ),
        static: (
          <>
            <p data-hj-suppress className="h5 font-weight-bold m-0 pb-1.5">
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
