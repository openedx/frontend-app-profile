/* eslint-disable react/prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { ensureConfig } from '@edx/frontend-platform';
import { AppContext } from '@edx/frontend-platform/react';
import { injectIntl, intlShape, FormattedDate } from '@edx/frontend-platform/i18n';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import {
  ActionRow, Avatar, Card, Hyperlink, Icon,
} from '@edx/paragon';
import { HistoryEdu, VerifiedUser } from '@edx/paragon/icons';

import get from 'lodash.get';

import PluginCountry from './forms/PluginCountry';
import { Plugin } from '../../plugins';

// Actions
import {
  fetchProfile,
} from './data/actions';

// Components
import PageLoading from './PageLoading';

// Selectors
import { profilePageSelector } from './data/selectors';

// i18n
import messages from './ProfilePage.messages';
import eduMessages from './forms/Education.messages';

import withParams from '../utils/hoc';

ensureConfig(['CREDENTIALS_BASE_URL', 'LMS_BASE_URL'], 'ProfilePage');

// eslint-disable-next-line react/function-component-definition
function Fallback() {
  return (
    <div>this is broken as all get</div>
  );
}

const platformDisplayInfo = {
  facebook: {
    icon: faFacebook,
    name: '',
  },
  twitter: {
    icon: faTwitter,
    name: '',
  },
  linkedin: {
    icon: faLinkedin,
    name: '',
  },
};

class ProfilePluginPage extends React.Component {
  componentDidMount() {
    this.props.fetchProfile(this.props.params.username);
  }

  renderContent() {
    const {
      profileImage,
      country,
      levelOfEducation,
      socialLinks,
      isLoadingProfile,
      dateJoined,
      intl,
    } = this.props;

    if (isLoadingProfile) {
      return <PageLoading srMessage={this.props.intl.formatMessage(messages['profile.loading'])} />;
    }

    return (
      <Plugin fallbackComponent={<Fallback />}>
        <Card className="mb-2">
          <Card.Header
            className="pb-5"
            subtitle={(
              <Hyperlink destination={`/u/${this.props.params.username}`} target="_parent">
                View public profile
              </Hyperlink>
            )}
            actions={
              (
                <ActionRow className="mt-3">
                  {socialLinks
                    .filter(({ socialLink }) => Boolean(socialLink))
                    .map(({ platform, socialLink }) => (
                      <StaticListItem
                        key={platform}
                        name={platformDisplayInfo[platform].name}
                        url={socialLink}
                        platform={platform}
                      />
                    ))}
                </ActionRow>
              )
            }
          />
          <Card.Section className="text-center" muted>
            <Avatar
              size="xl"
              className="profile-plugin-avatar"
              src={profileImage.src}
              alt="Profile image"
            />
            <h1 className="h2 mb-0 font-weight-bold">{this.props.params.username}</h1>
            <PluginCountry
              country={country}
            />
          </Card.Section>
          <Card.Footer className="p-0">
            <Card.Section className="pgn-icons-cell-vertical">
              <Icon src={VerifiedUser} />
              <p>
                since <FormattedDate value={new Date(dateJoined)} year="numeric" />
              </p>
            </Card.Section>
            <Card.Section className="pgn-icons-cell-vertical">
              <Icon src={HistoryEdu} />
              <p>
                {intl.formatMessage(get(
                  eduMessages,
                  `profile.education.levels.${levelOfEducation}`,
                  eduMessages['profile.education.levels.o'],
                ))}
              </p>
            </Card.Section>
          </Card.Footer>
        </Card>
      </Plugin>
    );
  }

  render() {
    return (
      <div className="profile-page overflow-hidden">
        {this.renderContent()}
      </div>
    );
  }
}

const SocialLink = ({ url, name, platform }) => (
  <a href={url} className="font-weight-bold">
    <FontAwesomeIcon className="mr-2" icon={platformDisplayInfo[platform].icon} />
    {name}
  </a>
);

const StaticListItem = ({ url, name, platform }) => (
  <ul className="list-inline">
    <SocialLink name={name} url={url} platform={platform} />
  </ul>
);

ProfilePluginPage.contextType = AppContext;

ProfilePluginPage.propTypes = {
  // Account data
  dateJoined: PropTypes.string,

  // Country form data
  country: PropTypes.string,

  // Education form data
  levelOfEducation: PropTypes.string,

  // Social links form data
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),

  // Other data we need
  profileImage: PropTypes.shape({
    src: PropTypes.string,
    isDefault: PropTypes.bool,
  }),
  isLoadingProfile: PropTypes.bool.isRequired,

  // Actions
  fetchProfile: PropTypes.func.isRequired,

  // Router
  params: PropTypes.shape({
    username: PropTypes.string.isRequired,
  }).isRequired,

  // i18n
  intl: intlShape.isRequired,
};

ProfilePluginPage.defaultProps = {
  profileImage: {},
  levelOfEducation: null,
  country: null,
  socialLinks: [],
  dateJoined: null,
};

export default connect(
  profilePageSelector,
  {
    fetchProfile,
  },
)(injectIntl(withParams(ProfilePluginPage)));
