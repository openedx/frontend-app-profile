import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { Route, Switch } from 'react-router-dom';
import { ConnectedRouter } from 'connected-react-router';
import { sendTrackEvent } from '@edx/frontend-analytics';
import SiteFooter from '@edx/frontend-component-footer';
import { fetchUserAccount, UserAccountApiService } from '@edx/frontend-auth';

import apiClient from '../config/apiClient';
import { getLocale, getMessages } from '@edx/frontend-i18n'; // eslint-disable-line
import SiteHeader from './common/SiteHeader';
import ConnectedProfilePage from './ProfilePage';

import FooterLogo from '../../assets/edx-footer.png';
import ErrorPage from './ErrorPage';
import NotFoundPage from './NotFoundPage';
import PageLoading from './common/PageLoading';

class App extends Component {
  componentDidMount() {
    const { username } = this.props;
    const userAccountApiService = new UserAccountApiService(apiClient, process.env.LMS_BASE_URL);
    this.props.fetchUserAccount(userAccountApiService, username);
  }

  renderContent() {
    if (!this.props.ready) {
      return <PageLoading />;
    }

    return (
      <div>
        <SiteHeader />
        <main>
          <Switch>
            <Route path="/u/:username" component={ConnectedProfilePage} />
            <Route path="/error" component={ErrorPage} />
            <Route path="/notfound" component={NotFoundPage} />
            <Route path="*" component={NotFoundPage} />
          </Switch>
        </main>
        <SiteFooter
          siteName={process.env.SITE_NAME}
          siteLogo={FooterLogo}
          marketingSiteBaseUrl={process.env.MARKETING_SITE_BASE_URL}
          supportUrl={process.env.SUPPORT_URL}
          contactUrl={process.env.CONTACT_URL}
          openSourceUrl={process.env.OPEN_SOURCE_URL}
          termsOfServiceUrl={process.env.TERMS_OF_SERVICE_URL}
          privacyPolicyUrl={process.env.PRIVACY_POLICY_URL}
          facebookUrl={process.env.FACEBOOK_URL}
          twitterUrl={process.env.TWITTER_URL}
          youTubeUrl={process.env.YOU_TUBE_URL}
          linkedInUrl={process.env.LINKED_IN_URL}
          googlePlusUrl={process.env.GOOGLE_PLUS_URL}
          redditUrl={process.env.REDDIT_URL}
          appleAppStoreUrl={process.env.APPLE_APP_STORE_URL}
          googlePlayUrl={process.env.GOOGLE_PLAY_URL}
          handleAllTrackEvents={sendTrackEvent}
        />
      </div>
    );
  }

  render() {
    return (
      <IntlProvider locale={getLocale()} messages={getMessages()}>
        <Provider store={this.props.store}>
          <ConnectedRouter history={this.props.history}>
            {this.renderContent()}
          </ConnectedRouter>
        </Provider>
      </IntlProvider>
    );
  }
}

App.propTypes = {
  fetchUserAccount: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  store: PropTypes.object.isRequired, // eslint-disable-line
  history: PropTypes.object.isRequired, // eslint-disable-line
  ready: PropTypes.bool,
};

App.defaultProps = {
  ready: false,
};

const mapStateToProps = state => ({
  username: state.authentication.username,
  // An error means that we tried to load the user account and failed,
  // which also means we're ready to display something.
  ready: state.userAccount.loaded || state.userAccount.error != null,
});

export default connect(
  mapStateToProps,
  {
    fetchUserAccount,
  },
)(App);
