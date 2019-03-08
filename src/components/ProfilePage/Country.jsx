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
import { ALL_COUNTRIES } from '../../constants/countries';

// Selectors
import { editableFormSelector } from '../../selectors/ProfilePageSelector';

class Country extends React.Component {
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
      formId, country, visibilityCountry, editMode, saveState, error,
    } = this.props;

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          editing: (
            <Form onSubmit={this.handleSubmit}>
              <FormGroup>
                <Label for="country">Location</Label>
                <Input
                  type="select"
                  id={formId}
                  name={formId}
                  className="w-100"
                  value={country}
                  invalid={error != null}
                  onChange={this.handleChange}
                >
                  {Object.keys(ALL_COUNTRIES).map(key => (
                    <option key={key} value={key}>{ALL_COUNTRIES[key]}</option>
                  ))}
                </Input>
                <FormFeedback>{error}</FormFeedback>
              </FormGroup>
              <FormControls
                visibilityId="visibilityCountry"
                saveState={saveState}
                visibility={visibilityCountry}
                cancelHandler={this.handleClose}
                changeHandler={this.handleChange}
              />
            </Form>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content="Location"
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityCountry !== null}
                visibility={visibilityCountry}
              />
              <h5>{ALL_COUNTRIES[country]}</h5>
            </React.Fragment>
          ),
          empty: (
            <EmptyContent onClick={this.handleOpen}>
              <FormattedMessage
                id="profile.country.empty"
                defaultMessage="Add location"
                description="instructions when the user doesn't have a location set"
              />
            </EmptyContent>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content="Location" />
              <h5>{ALL_COUNTRIES[country]}</h5>
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

Country.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  country: PropTypes.string,
  visibilityCountry: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
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
  editableFormSelector,
  {},
)(Country);
