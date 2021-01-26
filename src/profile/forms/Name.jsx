import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './Name.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

class Name extends React.Component {
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
      value,
    } = e.target;
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
      formId, name, visibilityName, editMode, saveState, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-5"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                  <EditableItemHeader content={intl.formatMessage(messages['profile.name.full.name'])} />
                  {/*
                  This isn't a mistake - the name field should not be editable.  But if it were,
                  you'd find the original code got deleted in the commit which added this comment.
                  -djoy
                  TODO: Relatedly, the plumbing for editing the name field is still in place.
                  Once we're super sure we don't want it back, you could delete the name props and
                  such to fully get rid of it.
                  */}
                  <p data-hj-suppress className="h5">{name}</p>
                  <small className="form-text text-muted" id={`${formId}-help-text`}>
                    {intl.formatMessage(messages['profile.name.details'])}
                  </small>
                </div>
                <FormControls
                  visibilityId="visibilityName"
                  saveState={saveState}
                  visibility={visibilityName}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.name.full.name'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityName !== null}
                visibility={visibilityName}
              />
              <p data-hj-suppress className="h5">{name}</p>
              <small className="form-text text-muted">
                {intl.formatMessage(messages['profile.name.details'])}
              </small>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.name.full.name'])} />
              <EmptyContent onClick={this.handleOpen}>
                {intl.formatMessage(messages['profile.name.empty'])}
              </EmptyContent>
              <small className="form-text text-muted">
                {intl.formatMessage(messages['profile.name.details'])}
              </small>
            </>
          ),
          static: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.name.full.name'])} />
              <p data-hj-suppress className="h5">{name}</p>
            </>
          ),
        }}
      />
    );
  }
}

Name.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  name: PropTypes.string,
  visibilityName: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

Name.defaultProps = {
  editMode: 'static',
  saveState: null,
  name: null,
  visibilityName: 'private',
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Name));
