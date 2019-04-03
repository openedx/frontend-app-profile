import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from 'react-intl';

import messages from './PreferredLanguage.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Constants
import { ALL_LANGUAGES } from '../../constants/languages';

// Selectors
import { editableFormSelector } from '../../selectors/ProfilePageSelector';

class PreferredLanguage extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const {
      name,
      value: rawValue,
    } = e.target;
    let value = rawValue;
    // Restructure the data.
    // We deconstruct our value prop in render() so this
    // changes our data's shape back to match what came in
    if (name === this.props.formId) {
      value = [{ code: rawValue }];
    }

    this.props.changeHandler(name, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitHandler(this.props.formId);
  }

  handleClose() {
    this.props.closeHandler(this.props.formId);
  }

  handleOpen() {
    this.props.openHandler(this.props.formId);
  }

  render() {
    const {
      formId,
      languageProficiencies,
      visibilityLanguageProficiencies,
      editMode,
      saveState,
      error,
      intl,
    } = this.props;

    const value = languageProficiencies.length ? languageProficiencies[0].code : '';

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <label htmlFor={formId} id={`${formId}-label`}>
                    {intl.formatMessage(messages['profile.preferredlanguage.label'])}
                  </label>
                  <select
                    id={formId}
                    name={formId}
                    className={`form-control w-100 ${error ? 'is-invalid' : ''}`}
                    value={value}
                    onChange={this.handleChange}
                    aria-describedby={`${formId}-error-feedback`}
                  >
                    {Object.entries(ALL_LANGUAGES).map(([code, name]) => (
                      <option key={code} value={code}>{name}</option>
                    ))}
                  </select>
                  <p className="invalid-feedback" id={`${formId}-error-feedback`}>{error}</p>
                </div>
                <FormControls
                  visibilityId="visibilityLanguageProficiencies"
                  saveState={saveState}
                  visibility={visibilityLanguageProficiencies}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.preferredlanguage.label'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityLanguageProficiencies !== null}
                visibility={visibilityLanguageProficiencies}
              />
              <p className="h5">{ALL_LANGUAGES[value]}</p>
            </React.Fragment>
          ),
          empty: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.preferredlanguage.label'])}
              />
              <EmptyContent onClick={this.handleOpen}>
                {intl.formatMessage(messages['profile.preferredlanguage.empty'])}
              </EmptyContent>
            </React.Fragment>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.preferredlanguage.label'])}
              />
              <p className="h5">{ALL_LANGUAGES[value]}</p>
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

PreferredLanguage.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  languageProficiencies: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string })),
    // TODO: ProfilePageSelector should supply null values
    // instead of empty strings when no value exists
    PropTypes.oneOf(['']),
  ]),
  visibilityLanguageProficiencies: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

PreferredLanguage.defaultProps = {
  editMode: 'static',
  saveState: null,
  languageProficiencies: [],
  visibilityLanguageProficiencies: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(PreferredLanguage));
