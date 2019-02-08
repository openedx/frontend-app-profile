import React, { Component } from 'react';

import { Alert as ReactstrapAlert } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle,
  faExclamationTriangle,
  faInfoCircle,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';

export default class Alert extends Component {
  componentDidMount() {}

  renderIcon() {
    let icon = null;

    switch (this.props.color) {
      case 'success':
        icon = faCheckCircle;
        break;
      case 'danger':
        icon = faExclamationCircle;
        break;
      case 'warning':
        icon = faExclamationTriangle;
        break;
      case 'info':
        icon = faInfoCircle;
        break;
      default:
    }

    return (
      <div className="flex-grow-0 mr-2">
        <FontAwesomeIcon icon={icon} />
      </div>
    );
  }

  render() {
    return (
      <ReactstrapAlert
        className="d-flex"
        {...this.props}
      >
        {this.renderIcon()}
        <div className="flex-grow-1">
          {this.props.children} {/* eslint-disable-line react/prop-types */}
        </div>
      </ReactstrapAlert>
    );
  }
}

Alert.propTypes = {
  ...ReactstrapAlert.propTypes,
};

Alert.defaultProps = {
  ...ReactstrapAlert.defaultProps,
};
