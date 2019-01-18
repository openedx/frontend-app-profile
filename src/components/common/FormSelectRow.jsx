import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import FormRow from './FormRow';

export default class FormSelectRow extends Component {
  renderOptions() {
    return this.props.options.map(this.renderOption);
  }

  renderOption(option) {
    return <option key={option.value} value={option.value}>{option.name}</option>;
  }

  render() {
    const {
      inputName, onChange, options, ...formRowProps
    } = this.props;

    return (
      <FormRow {...formRowProps}>
        <Input
          type="select"
          name={inputName}
          id={this.props.inputId}
          value={this.props.inputValue}
          onChange={onChange}
        >
          {this.renderOptions()}
        </Input>
      </FormRow>
    );
  }
}

FormSelectRow.propTypes = {
  // Props
  onChange: PropTypes.func.isRequired,
  inputName: PropTypes.string.isRequired,
  options: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    value: PropTypes.string.isRequired,
  })),

  // FormRow props
  ...FormRow.propTypes,
};

FormSelectRow.defaultProps = {
  options: [],

  // FormRow defaults
  ...FormRow.defaultProps,
};
