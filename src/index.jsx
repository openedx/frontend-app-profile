import 'babel-polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Provider } from 'react-redux';
import SiteFooter from '@edx/frontend-component-footer';

import apiClient from './data/apiClient';
import { handleTrackEvents } from './analytics';
import UserAccount from './components/UserAccount';
import store from './data/store';
import FooterLogo from '../assets/edx-footer.png';
import './App.scss';

const App = () => (
  <Provider store={store}>
    <Router>
      <div>
        <main>
          <Switch>
            <Route exact path="/" component={UserAccount} />
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
);

if (apiClient.ensurePublicOrAuthencationAndCookies(window.location.pathname)) {
  ReactDOM.render(<App />, document.getElementById('root'));
}
