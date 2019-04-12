import React from 'react';
import { injectIntl, intlShape } from 'react-intl';


const injectIntlWithShim = (WrappedComponent) => {
  class ShimmedIntlComponent extends React.Component {
    static propTypes = {
      intl: intlShape.isRequired,
    };

    constructor(props) {
      super(props);
      this.shimmedIntl = Object.create(this.props.intl, {
        formatMessage: {
          value: (definition) => {
            if (definition === undefined) {
              if (process.env.NODE_ENV !== 'production') {
                // eslint-disable-next-line no-console
                console.error('i18n error: An undefined message was supplied to intl.formatMessage.');
                return '!!! Missing message supplied to intl.formatMessage !!!';
              }
              return ''; // Fail silent in production
            }
            return this.props.intl.formatMessage(definition);
          },
        },
      });
    }

    render() {
      return <WrappedComponent {...this.props} intl={this.shimmedIntl} />;
    }
  }

  return injectIntl(ShimmedIntlComponent);
};


export default injectIntlWithShim;
