import { connect } from 'react-redux';
import SiteHeader from '@edx/frontend-component-site-header';
import { injectIntl } from 'react-intl';

import messages from './SiteHeader.messages';

import Logo from '../../assets/logo.svg';

const mapStateToProps = (state, { intl }) => ({
  logo: Logo,
  logoDestination: process.env.MARKETING_SITE_BASE_URL,
  logoAltText: 'edX',
  mainMenu: [
    {
      type: 'item',
      href: `${process.env.MARKETING_SITE_BASE_URL}/course`,
      content: intl.formatMessage(messages['siteheader.links.courses']),
    },
    {
      type: 'item',
      href: `${process.env.MARKETING_SITE_BASE_URL}/course?program=all`,
      content: intl.formatMessage(messages['siteheader.links.programs']),
    },
    {
      type: 'item',
      href: `${process.env.MARKETING_SITE_BASE_URL}/schools-partners`,
      content: intl.formatMessage(messages['siteheader.links.schools']),
    },
  ],
  loggedIn: true,
  username: state.userAccount.username,
  avatar: state.userAccount.profileImage.imageUrlMedium,
  userMenu: [
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}`,
      content: intl.formatMessage(messages['siteheader.user.menu.dashboard']),
    },
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}/profile`,
      content: intl.formatMessage(messages['siteheader.user.menu.profile']),
    },
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}/account/settings`,
      content: intl.formatMessage(messages['siteheader.user.menu.account.settings']),
    },
    {
      type: 'item',
      href: process.env.LOGOUT_URL,
      content: intl.formatMessage(messages['siteheader.user.menu.logout']),
    },
  ],
  loggedOutItems: [
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}/login`,
      content: intl.formatMessage(messages['siteheader.user.menu.login']),
    },
    {
      type: 'item',
      href: `${process.env.LMS_BASE_URL}/register`,
      content: intl.formatMessage(messages['siteheader.user.menu.register']),
    },
  ],
});

export default injectIntl(connect(mapStateToProps)(SiteHeader));
