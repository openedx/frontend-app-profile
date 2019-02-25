import React, { Component } from 'react';
import { connect, Provider } from 'react-redux';
import PropTypes from 'prop-types';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import SiteFooter from '@edx/frontend-component-footer';
import { fetchUserAccount, UserAccountApiService } from '@edx/frontend-auth';

import apiClient from '../config/apiClient';
import { handleTrackEvents } from '../analytics';
import { getLocale, getMessages } from '../i18n/i18n-loader';
import SiteHeader from './/SiteHeader';
import ConnectedProfilePage from './ProfilePage';

import HeaderLogo from '../../assets/edx-sm.png';
import FooterLogo from '../../assets/edx-footer.png';
import NotFoundPage from './NotFoundPage';

class App extends Component {
  componentDidMount() {
    const { username } = this.props;
    const userAccountApiService = new UserAccountApiService(apiClient, process.env.LMS_BASE_URL);
    this.props.fetchUserAccount(userAccountApiService, username);
  }

  render() {
    return (
      <IntlProvider locale={getLocale()} messages={getMessages()}>
        <Provider store={this.props.store}>
          <Router>
            <div>
              <SiteHeader
                logo={HeaderLogo}
                logoDestination={process.env.MARKETING_SITE_BASE_URL}
                logoAltText={process.env.SITE_NAME}
              />
              <main>
                <Switch>
                  <Route path="/u/:username" component={ConnectedProfilePage} />
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
                handleAllTrackEvents={handleTrackEvents}
              />
            </div>
          </Router>
        </Provider>
      </IntlProvider>
    );
  }
}

App.propTypes = {
  fetchUserAccount: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  store: PropTypes.object.isRequired, // eslint-disable-line
};

const mapStateToProps = state => ({
  username: state.authentication.username,
});

export default connect(
  mapStateToProps,
  {
    fetchUserAccount,
  },
)(App);
