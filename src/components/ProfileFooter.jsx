import React from 'react';
import SiteFooter from '@edx/frontend-component-footer';
import { sendTrackEvent } from '@edx/frontend-analytics';
import {
  faFacebookSquare,
  faTwitterSquare,
  faYoutubeSquare,
  faLinkedin,
  faRedditSquare,
} from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import App from '../../frontend-core/App';

import FooterLogo from '../assets/edx-footer.png';

export default function ProfileFooter() {
  const socialLinks = [
    {
      title: 'Facebook',
      url: App.config.FACEBOOK_URL,
      icon: <FontAwesomeIcon icon={faFacebookSquare} className="social-icon" size="2x" />,
      screenReaderText: 'Like edX on Facebook',
    },
    {
      title: 'Twitter',
      url: App.config.TWITTER_URL,
      icon: <FontAwesomeIcon icon={faTwitterSquare} className="social-icon" size="2x" />,
      screenReaderText: 'Follow edX on Twitter',
    },
    {
      title: 'Youtube',
      url: App.config.YOU_TUBE_URL,
      icon: <FontAwesomeIcon icon={faYoutubeSquare} className="social-icon" size="2x" />,
      screenReaderText: 'Subscribe to the edX YouTube channel',
    },
    {
      title: 'LinkedIn',
      url: App.config.LINKED_IN_URL,
      icon: <FontAwesomeIcon icon={faLinkedin} className="social-icon" size="2x" />,
      screenReaderText: 'Follow edX on LinkedIn',
    },
    {
      title: 'Reddit',
      url: App.config.REDDIT_URL,
      icon: <FontAwesomeIcon icon={faRedditSquare} className="social-icon" size="2x" />,
      screenReaderText: 'Subscribe to the edX subreddit',
    },
  ];

  const enterpriseMarketingLinkData = {
    url: App.config.ENTERPRISE_MARKETING_URL,
    queryParams: {
      utm_campaign: App.config.ENTERPRISE_MARKETING_UTM_CAMPAIGN,
      utm_source: App.config.ENTERPRISE_MARKETING_UTM_SOURCE,
      utm_medium: App.config.ENTERPRISE_MARKETING_FOOTER_UTM_MEDIUM,
    },
  };

  return (
    <SiteFooter
      siteName={App.config.SITE_NAME}
      siteLogo={FooterLogo}
      marketingSiteBaseUrl={App.config.MARKETING_SITE_BASE_URL}
      enterpriseMarketingLink={enterpriseMarketingLinkData}
      supportUrl={App.config.SUPPORT_URL}
      contactUrl={App.config.CONTACT_URL}
      openSourceUrl={App.config.OPEN_SOURCE_URL}
      termsOfServiceUrl={App.config.TERMS_OF_SERVICE_URL}
      privacyPolicyUrl={App.config.PRIVACY_POLICY_URL}
      socialLinks={socialLinks}
      appleAppStoreUrl={App.config.APPLE_APP_STORE_URL}
      googlePlayUrl={App.config.GOOGLE_PLAY_URL}
      handleAllTrackEvents={sendTrackEvent}
    />
  );
}
