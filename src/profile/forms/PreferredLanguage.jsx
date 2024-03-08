import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import { Form } from '@openedx/paragon';

import messages from './PreferredLanguage.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { preferredLanguageSelector } from '../data/selectors';

class PreferredLanguage extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
    // Restructure the data.
    // We deconstruct our value prop in render() so this
    // changes our data's shape back to match what came in
    if (name === this.props.formId) {
      if (value !== '') {
        this.props.changeHandler(name, [{ code: value }]);
      } else {
        this.props.changeHandler(name, []);
      }
    } else {
      this.props.changeHandler(name, value);
    }
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
      sortedLanguages,
      languageMessages,
    } = this.props;

    const value = languageProficiencies.length ? languageProficiencies[0].code : '';

    return (
      <SwitchContent
        className="mb-5"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <form onSubmit={this.handleSubmit}>
                <Form.Group
                  controlId={formId}
                  isInvalid={error !== null}
                >
                  <label className="edit-section-header" htmlFor={formId}>
                    {intl.formatMessage(messages['profile.preferredlanguage.label'])}
                  </label>
                  <select
                    data-hj-suppress
                    id={formId}
                    name={formId}
                    className="form-control"
                    value={value}
                    onChange={this.handleChange}
                  >
                    <option value="">&nbsp;</option>
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
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.preferredlanguage.label'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityLanguageProficiencies !== null}
                visibility={visibilityLanguageProficiencies}
              />
              <p data-hj-suppress className="h5">{languageMessages[value]}</p>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.preferredlanguage.label'])}
              />
              <EmptyContent onClick={this.handleOpen}>
                {intl.formatMessage(messages['profile.preferredlanguage.empty'])}
              </EmptyContent>
            </>
          ),
          static: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.preferredlanguage.label'])}
              />
              <p data-hj-suppress className="h5">{languageMessages[value]}</p>
            </>
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
  sortedLanguages: PropTypes.arrayOf(PropTypes.shape({
    code: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
  })).isRequired,
  languageMessages: PropTypes.objectOf(PropTypes.string).isRequired,

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
  preferredLanguageSelector,
  {},
)(injectIntl(PreferredLanguage));
