import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl, intlShape } from '@edx/frontend-platform/i18n';

import messages from './DisplayName.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';
import DateJoined from "../DateJoined";
import {ValidationFormGroup} from "@edx/paragon";

class DisplayName extends React.Component {
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
      formId, displayName, dateJoined, editMode, error, saveState, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-5"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <form onSubmit={this.handleSubmit}>
                <ValidationFormGroup
                  for={formId}
                  invalid={error !== null}
                  invalidMessage={error}
                >
                  <label className="edit-section-header" htmlFor={formId}>
                    {intl.formatMessage(messages['profile.displayname.name'])}
                  </label>
                  <textarea
                    className="form-control"
                    id={formId}
                    name={formId}
                    value={displayName}
                    onChange={this.handleChange}
                  />
                </ValidationFormGroup>
                <FormControls
                  saveState={saveState}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.displayname.name'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={false}
              />
              <h1 className="h2 mb-0 font-weight-bold">{displayName}</h1>
              <small className="form-text text-muted">
                {intl.formatMessage(messages['profile.displayname.details'])}
              </small>
              <DateJoined date={dateJoined} />
            </React.Fragment>
          ),
          empty: (
            <React.Fragment>
	      {/* Can this section(empty) just go away if it's not allowed to be empty? */}
              <EditableItemHeader content={intl.formatMessage(messages['profile.displayname.name'])} />
              <EmptyContent onClick={this.handleOpen}>
                {intl.formatMessage(messages['profile.displayname.empty'])}
              </EmptyContent>
              <small className="form-text text-muted">
                {intl.formatMessage(messages['profile.displayname.details'])}
              </small>
            </React.Fragment>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content={intl.formatMessage(messages['profile.displayname.name'])} />
              <h1 className="h2 mb-0 font-weight-bold">{displayName}</h1>
              <DateJoined date={dateJoined} />
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

DisplayName.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  displayName: PropTypes.string,
  dateJoined: PropTypes.string,
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

DisplayName.defaultProps = {
  editMode: 'static',
  saveState: null,
  displayName: null,
  dateJoined: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(DisplayName));
