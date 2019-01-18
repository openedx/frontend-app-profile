import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';

import FormRow from './FormRow';

export default class FormButtonRow extends Component {
  componentDidMount() {
    // eslint, stop telling me this should be a functional component.  I'm not ready yet!
  }

  render() {
    const {
      onClick,
      color,
      buttonText,
      ...formRowProps
    } = this.props;

    return (
      <FormRow {...formRowProps}>
        <div className="pt-1 pb-1">
          <Button color={color} onClick={onClick} id={this.props.inputId}>
            {buttonText}
          </Button>
        </div>
      </FormRow>
    );
  }
}

FormButtonRow.propTypes = {
  buttonText: PropTypes.string.isRequired,
  color: PropTypes.oneOf(['outline-primary', 'primary', 'success', 'info', 'warning', 'danger']),
  onClick: PropTypes.func.isRequired,

  // FormRow props
  ...FormRow.propTypes,
};

FormButtonRow.defaultProps = {
  color: 'outline-primary',

  // FormRow default props
  ...FormRow.defaultProps,
};
