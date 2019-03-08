import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormFeedback, FormGroup, FormText, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { injectIntl, intlShape, FormattedMessage } from 'react-intl';

import messages from './Name.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../../selectors/ProfilePageSelector';

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
      formId, name, visibilityName, editMode, saveState, error, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <Form onSubmit={this.handleSubmit}>
                <FormGroup>
                  <Label for="name" id={`${formId}-label`}>Full Name</Label>
                  <Input
                    type="text"
                    id={formId}
                    name={formId}
                    value={name}
                    invalid={error != null}
                    onChange={this.handleChange}
                    aria-describedby={`${formId}-error-feedback ${formId}-help-text`}
                  />
                  <FormText id={`${formId}-help-text`}>
                    <FormattedMessage
                      id="profile.name.details"
                      defaultMessage="This is the name that appears in your account and on your certificates."
                      description="describes the area for the user to update their name"
                    />
                  </FormText>
                  <FormFeedback id={`${formId}-error-feedback`}>{error}</FormFeedback>
                </FormGroup>
                <FormControls
                  visibilityId="visibilityName"
                  saveState={saveState}
                  visibility={visibilityName}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </Form>
            </div>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.name.full.name'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityName !== null}
                visibility={visibilityName}
              />
              <p className="h5">{name}</p>
            </React.Fragment>
          ),
          empty: (
            <EmptyContent onClick={this.handleOpen}>
              <FormattedMessage
                id="profile.name.empty"
                defaultMessage="Add name"
                description="instructions when the user hasn't entered their name"
              />
            </EmptyContent>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content={intl.formatMessage(messages['profile.name.full.name'])} />
              <p className="h5">{name}</p>
            </React.Fragment>
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
  error: PropTypes.string,

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
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Name));
