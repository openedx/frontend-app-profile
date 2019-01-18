import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { FormGroup, Label, FormText } from 'reactstrap';


export default class FormRow extends Component {
  renderHelpText() {
    if (this.props.helpText === null) {
      return null;
    }

    return (
      <FormText color="muted">
        {this.props.helpText}
      </FormText>
    );
  }

  renderFormElement() {
    if (this.props.displayOnly) {
      return (
        <div className="lead">{this.props.inputValue}</div>
      );
    }

    return this.props.children; // eslint-disable-line react/prop-types
  }

  render() {
    return (
      <FormGroup className="pb-1">
        <Label for={this.props.inputId}>
          {this.props.label}
          {this.renderFormElement()}
          {this.renderHelpText()}
        </Label>
      </FormGroup>
    );
  }
}

FormRow.propTypes = {
  displayOnly: PropTypes.bool,
  helpText: PropTypes.string,
  inputId: PropTypes.string.isRequired,
  inputValue: PropTypes.string,
  label: PropTypes.string.isRequired,
};

FormRow.defaultProps = {
  helpText: null,
  displayOnly: false,
  inputValue: null,
};
