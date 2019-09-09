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
import validateConfig from '../../frontend-core/validateConfig';

import FooterLogo from '../assets/edx-footer.png';

const config = {
  APPLE_APP_STORE_URL: process.env.APPLE_APP_STORE_URL,
  CONTACT_URL: process.env.CONTACT_URL,
  ENTERPRISE_MARKETING_FOOTER_UTM_MEDIUM: process.env.ENTERPRISE_MARKETING_FOOTER_UTM_MEDIUM,
  ENTERPRISE_MARKETING_URL: process.env.ENTERPRISE_MARKETING_URL,
  ENTERPRISE_MARKETING_UTM_CAMPAIGN: process.env.ENTERPRISE_MARKETING_UTM_CAMPAIGN,
  ENTERPRISE_MARKETING_UTM_SOURCE: process.env.ENTERPRISE_MARKETING_UTM_SOURCE,
  FACEBOOK_URL: process.env.FACEBOOK_URL,
  GOOGLE_PLAY_URL: process.env.GOOGLE_PLAY_URL,
  LINKED_IN_URL: process.env.LINKED_IN_URL,
  OPEN_SOURCE_URL: process.env.OPEN_SOURCE_URL,
  PRIVACY_POLICY_URL: process.env.PRIVACY_POLICY_URL,
  REDDIT_URL: process.env.REDDIT_URL,
  SUPPORT_URL: process.env.SUPPORT_URL,
  TERMS_OF_SERVICE_URL: process.env.TERMS_OF_SERVICE_URL,
  TWITTER_URL: process.env.TWITTER_URL,
  YOU_TUBE_URL: process.env.YOU_TUBE_URL,
};

App.requireConfig(['SITE_NAME', 'MARKETING_SITE_BASE_URL'], 'ProfileFooter');
validateConfig(config, 'ProfileFooter');

export default function ProfileFooter() {
  const socialLinks = [
    {
      title: 'Facebook',
      url: config.FACEBOOK_URL,
      icon: <FontAwesomeIcon icon={faFacebookSquare} className="social-icon" size="2x" />,
      screenReaderText: 'Like edX on Facebook',
    },
    {
      title: 'Twitter',
      url: config.TWITTER_URL,
      icon: <FontAwesomeIcon icon={faTwitterSquare} className="social-icon" size="2x" />,
      screenReaderText: 'Follow edX on Twitter',
    },
    {
      title: 'Youtube',
      url: config.YOU_TUBE_URL,
      icon: <FontAwesomeIcon icon={faYoutubeSquare} className="social-icon" size="2x" />,
      screenReaderText: 'Subscribe to the edX YouTube channel',
    },
    {
      title: 'LinkedIn',
      url: config.LINKED_IN_URL,
      icon: <FontAwesomeIcon icon={faLinkedin} className="social-icon" size="2x" />,
      screenReaderText: 'Follow edX on LinkedIn',
    },
    {
      title: 'Reddit',
      url: config.REDDIT_URL,
      icon: <FontAwesomeIcon icon={faRedditSquare} className="social-icon" size="2x" />,
      screenReaderText: 'Subscribe to the edX subreddit',
    },
  ];

  const enterpriseMarketingLinkData = {
    url: config.ENTERPRISE_MARKETING_URL,
    queryParams: {
      utm_campaign: config.ENTERPRISE_MARKETING_UTM_CAMPAIGN,
      utm_source: config.ENTERPRISE_MARKETING_UTM_SOURCE,
      utm_medium: config.ENTERPRISE_MARKETING_FOOTER_UTM_MEDIUM,
    },
  };

  return (
    <SiteFooter
      appleAppStoreUrl={config.APPLE_APP_STORE_URL}
      contactUrl={config.CONTACT_URL}
      enterpriseMarketingLink={enterpriseMarketingLinkData}
      googlePlayUrl={config.GOOGLE_PLAY_URL}
      handleAllTrackEvents={sendTrackEvent}
      marketingSiteBaseUrl={App.config.MARKETING_SITE_BASE_URL}
      openSourceUrl={config.OPEN_SOURCE_URL}
      privacyPolicyUrl={config.PRIVACY_POLICY_URL}
      siteLogo={FooterLogo}
      siteName={App.config.SITE_NAME}
      socialLinks={socialLinks}
      supportUrl={config.SUPPORT_URL}
      termsOfServiceUrl={config.TERMS_OF_SERVICE_URL}
    />
  );
}
