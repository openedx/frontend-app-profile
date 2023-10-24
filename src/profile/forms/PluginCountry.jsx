import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { injectIntl } from '@edx/frontend-platform/i18n';
import { Icon } from '@edx/paragon';
import { LocationOn } from '@edx/paragon/icons';

// Selectors
import { countrySelector } from '../data/selectors';

// eslint-disable-next-line react/prefer-stateless-function
class PluginCountry extends React.Component {
  render() {
    const {
      country,
      countryMessages,
    } = this.props;

    return (
      <div className="pgn-icons-cell-horizontal">
        <Icon src={LocationOn} />
        <p className="h5 mt-1 ml-1">{countryMessages[country]}</p>
      </div>
    );
  }
}

PluginCountry.propTypes = {
  country: PropTypes.string,
  countryMessages: PropTypes.objectOf(PropTypes.string).isRequired,
};

PluginCountry.defaultProps = {
  country: null,
};

export default connect(
  countrySelector,
  {},
)(injectIntl(PluginCountry));
