import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import messages from './Bio.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../../selectors/ProfilePageSelector';

class Bio extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;
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
      formId, bio, visibilityBio, editMode, saveState, error, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <form onSubmit={this.handleSubmit}>
                {/*
                  If we wrote our own form group component, maybe
                  it would look like this. Encapsulates everything
                  inside div.form-group

                  <FormGroup
                    // group info, or shared among child nodes
                    id={formId}
                    inline
                    invalid={error != null}

                    // input info
                    value={bio}
                    inputType="textarea"
                    inputName={formId}

                    // Meta/help/errors
                    label={intl.formatMessage(messages['profile.bio.about.me'])}
                    helpText=""
                    errorMessage={error}
                    validMessage={successMessage}

                    // event handlers for input
                    onInputChange={this.handleChange}
                  />
                */}
                <div className="form-group">
                  <label htmlFor={formId} id={`${formId}-label`}>
                    {intl.formatMessage(messages['profile.bio.about.me'])}
                  </label>
                  <textarea
                    className={`form-control ${error ? 'is-invalid' : ''}`}
                    type="textarea"
                    id={formId}
                    name={formId}
                    value={bio}
                    onChange={this.handleChange}
                    aria-describedby={`${formId}-error-feedback`}
                  />
                  <p className="invalid-feedback" id={`${formId}-error-feedback`}>{error}</p>
                </div>
                <FormControls
                  visibilityId="visibilityBio"
                  saveState={saveState}
                  visibility={visibilityBio}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.bio.about.me'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityBio !== null}
                visibility={visibilityBio}
              />
              <p className="lead">{bio}</p>
            </React.Fragment>
          ),
          empty: (
            <React.Fragment>
              <EditableItemHeader content={intl.formatMessage(messages['profile.bio.about.me'])} />
              <EmptyContent onClick={this.handleOpen}>
                <FormattedMessage
                  id="profile.bio.empty"
                  defaultMessage="Add a short bio"
                  description="instructions when the user hasn't written an About Me"
                />
              </EmptyContent>
            </React.Fragment>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content={intl.formatMessage(messages['profile.bio.about.me'])} />
              <p className="lead">{bio}</p>
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

Bio.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  bio: PropTypes.string,
  visibilityBio: PropTypes.oneOf(['private', 'all_users']),
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

Bio.defaultProps = {
  editMode: 'static',
  saveState: null,
  bio: null,
  visibilityBio: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Bio));
