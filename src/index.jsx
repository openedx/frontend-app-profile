import 'babel-polyfill';

import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { IntlProvider } from 'react-intl';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import SiteFooter from '@edx/frontend-component-footer';
import { fetchUserAccount, UserAccountApiService } from '@edx/frontend-auth';

import { getLocale, getMessages } from './i18n/i18n-loader';
import apiClient from './data/apiClient';
import { handleTrackEvents, identifyUser } from './analytics';
import SiteHeader from './containers/SiteHeader';
import UserProfile from './containers/UserProfile';
import store from './data/store';
import HeaderLogo from '../assets/edx-sm.png';
import FooterLogo from '../assets/edx-footer.png';
import './App.scss';
import NotFoundPage from './components/NotFoundPage';

class App extends Component {
  componentDidMount() {
    const { username } = store.getState().authentication;
    const userAccountApiService = new UserAccountApiService(apiClient, process.env.LMS_BASE_URL);
    store.dispatch(fetchUserAccount(userAccountApiService, username));
  }

  render() {
    return (
      <IntlProvider locale={getLocale()} messages={getMessages()}>
        <Provider store={store}>
          <Router>
            <div>
              <SiteHeader
                logo={HeaderLogo}
                logoDestination={process.env.MARKETING_SITE_BASE_URL}
                logoAltText={process.env.SITE_NAME}
              />
              <main>
                <Switch>
                  <Route path="/u/:username" component={UserProfile} />
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

if (apiClient.ensurePublicOrAuthencationAndCookies(window.location.pathname)) {
  ReactDOM.render(<App />, document.getElementById('root'));

  // identify user for future analytics calls
  // TODO: Call before each page call.
  identifyUser();
}
