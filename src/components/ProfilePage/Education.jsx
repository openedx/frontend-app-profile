import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';

import messages from './Education.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Constants
import EDUCATION from '../../constants/education';

// Selectors
import { editableFormSelector } from '../../selectors/ProfilePageSelector';

class Education extends React.Component {
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
      formId, education, visibilityEducation, editMode, saveState, error, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          editing: (
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="education">
                  {intl.formatMessage(messages['profile.education.education'])}
                </Label>
                <Input
                  type="select"
                  id={formId}
                  name={formId}
                  className="w-100"
                  value={education}
                  invalid={error != null}
                  onChange={this.handleChange}
                >
                  {Object.keys(EDUCATION).map(key => (
                    <option key={key} value={key}>{EDUCATION[key]}</option>
                  ))}
                </Input>
                <FormFeedback>{error}</FormFeedback>
              </FormGroup>
              <FormControls
                visibilityId="visibilityEducation"
                saveState={saveState}
                visibility={visibilityEducation}
                cancelHandler={this.handleClose}
                changeHandler={this.handleChange}
              />
            </Form>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.education.education'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityEducation !== null}
                visibility={visibilityEducation}
              />
              <h5>{EDUCATION[education]}</h5>
            </React.Fragment>
          ),
          empty: (
            <EmptyContent onClick={this.handleOpen}>
              <FormattedMessage
                id="profile.education.empty"
                defaultMessage="Add education"
                description="instructions when the user doesn't have their level of education set"
              />
            </EmptyContent>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content={intl.formatMessage(messages['profile.education.education'])} />
              <h5>{EDUCATION[education]}</h5>
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

Education.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  education: PropTypes.string,
  visibilityEducation: PropTypes.oneOf(['private', 'all_users']),
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

Education.defaultProps = {
  editMode: 'static',
  saveState: null,
  education: null,
  visibilityEducation: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Education));
