import React from 'react';
import PropTypes from 'prop-types';
import { Form, FormFeedback, FormGroup, Input, Label } from 'reactstrap';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';

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
    // Restructure the data.
    // We deconstruct our value prop in render() so this
    // changes our data's shape back to match what came in
    const value = [{ code: rawValue }];

    this.props.changeHandler(this.props.formId, name, value);
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
      formId, value: valueArr, visibility, editMode, saveState, error,
    } = this.props;

    const value = valueArr.length ? valueArr[0].code : '';

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          editing: (
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="language">Preferred Language</Label>
                <Input
                  type="select"
                  name={formId}
                  className="w-100"
                  value={value}
                  invalid={error != null}
                  onChange={this.handleChange}
                >
                  {Object.entries(ALL_LANGUAGES).map(([code, name]) => (
                    <option key={code} value={code}>{name}</option>
                  ))}
                </Input>
                <FormFeedback>{error}</FormFeedback>
              </FormGroup>
              <FormControls
                formId={formId}
                saveState={saveState}
                visibility={visibility}
                cancelHandler={this.handleClose}
                changeHandler={this.handleChange}
              />
            </Form>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content="Preferred Language"
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibility !== null}
                visibility={visibility}
              />
              <h5>{ALL_LANGUAGES[value]}</h5>
            </React.Fragment>
          ),
          empty: (
            <EmptyContent onClick={this.handleOpen}>
              <FormattedMessage
                id="profile.preferredlanguage.empty"
                defaultMessage="Add language"
                description="instructions when the user doesn't have a location set"
              />
            </EmptyContent>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content="Location" />
              <h5>{ALL_LANGUAGES[value]}</h5>
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
  value: PropTypes.arrayOf(PropTypes.shape({ code: PropTypes.string })),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

PreferredLanguage.defaultProps = {
  editMode: 'static',
  saveState: null,
  value: null,
  visibility: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(PreferredLanguage);
