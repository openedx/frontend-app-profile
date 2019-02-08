import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import FormRow from './FormRow';

export default class FormTextInputRow extends Component {
  componentDidMount() {
    // eslint, stop telling me this should be a functional component!  I'm not ready yet!
  }

  render() {
    const {
      inputName, onChange, type, ...formRowProps
    } = this.props;

    return (
      <FormRow {...formRowProps}>
        <Input
          type={type}
          name={this.props.inputName}
          id={this.props.inputId}
          value={this.props.inputValue}
          onChange={onChange}
        />
      </FormRow>
    );
  }
}

FormTextInputRow.propTypes = {
  inputName: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  type: PropTypes.oneOf(['text', 'email', 'url', 'search', 'tel', 'password', 'textarea']),

  // FormRow props
  ...FormRow.propTypes,
};

FormTextInputRow.defaultProps = {
  type: 'text',

  // FormRow default props
  ...FormRow.defaultProps,
};
