import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@openedx/paragon';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

import messages from './SocialLinks.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';

const platformDisplayInfo = {
  facebook: {
    icon: faFacebook,
    name: 'Facebook',
  },
  twitter: {
    icon: faTwitter,
    name: 'Twitter',
  },
  linkedin: {
    icon: faLinkedin,
    name: 'LinkedIn',
  },
};

const SocialLink = ({ url, name, platform }) => (
  <a href={url} className="font-weight-bold">
    <FontAwesomeIcon className="mr-2" icon={platformDisplayInfo[platform].icon} />
    {name}
  </a>
);

SocialLink.propTypes = {
  url: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

const EditableListItem = ({
  url, platform, onClickEmptyContent, name,
}) => {
  const linkDisplay = url ? (
    <SocialLink name={name} url={url} platform={platform} />
  ) : (
    <EmptyContent onClick={onClickEmptyContent}>Add {name}</EmptyContent>
  );

  return <li className="form-group">{linkDisplay}</li>;
};

EditableListItem.propTypes = {
  url: PropTypes.string,
  platform: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  onClickEmptyContent: PropTypes.func,
};
EditableListItem.defaultProps = {
  url: null,
  onClickEmptyContent: null,
};

const EditingListItem = ({
  platform, name, value, onChange, error,
}) => (
  <li className="form-group">
    <label htmlFor={`social-${platform}`}>{name}</label>
    <input
      className={classNames('form-control', { 'is-invalid': Boolean(error) })}
      type="text"
      id={`social-${platform}`}
      name={platform}
      value={value || ''}
      onChange={onChange}
      aria-describedby="social-error-feedback"
    />
  </li>
);

EditingListItem.propTypes = {
  platform: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
};

EditingListItem.defaultProps = {
  value: null,
  error: null,
};

const EmptyListItem = ({ onClick, name }) => (
  <li className="mb-4">
    <EmptyContent onClick={onClick}>
      <FormattedMessage
        id="profile.sociallinks.add"
        defaultMessage="Add {network}"
        values={{
          network: name,
        }}
        description="{network} is the name of a social network such as Facebook or Twitter"
      />
    </EmptyContent>
  </li>
);

EmptyListItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

const StaticListItem = ({ name, url, platform }) => (
  <li className="mb-2">
    <SocialLink name={name} url={url} platform={platform} />
  </li>
);

StaticListItem.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string,
  platform: PropTypes.string.isRequired,
};

StaticListItem.defaultProps = {
  url: null,
};

class SocialLinks extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const { name, value } = e.target;

    // The social links are a bit special. If we're updating them, we need to merge them
    // with any existing social link drafts, essentially sending a fresh copy of the whole
    // data structure back to the reducer. This helps the reducer stay simple and keeps
    // special cases out of it, concentrating them here, where they began.
    if (name !== 'visibilitySocialLinks') {
      this.props.changeHandler(
        'socialLinks',
        this.mergeWithDrafts({
          platform: name,
          // If it's an empty string, send it as null.
          // The empty string is just for the input.  We want nulls.
          socialLink: value,
        }),
      );
    } else {
      this.props.changeHandler(name, value);
    }
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitHandler(this.props.formId);
  }

  handleClose() {
    this.props.closeHandler(this.props.formId);
  }

  handleOpen() {
    this.props.openHandler(this.props.formId);
  }

  mergeWithDrafts(newSocialLink) {
    const knownPlatforms = ['twitter', 'facebook', 'linkedin'];
    const updated = [];
    knownPlatforms.forEach((platform) => {
      if (newSocialLink.platform === platform) {
        updated.push(newSocialLink);
      } else if (this.props.draftSocialLinksByPlatform[platform] !== undefined) {
        updated.push(this.props.draftSocialLinksByPlatform[platform]);
      }
    });
    return updated;
  }

  render() {
    const {
      socialLinks, visibilitySocialLinks, editMode, saveState, error, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-5"
        expression={editMode}
        cases={{
          empty: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.sociallinks.social.links'])} />
              <ul className="list-unstyled">
                {socialLinks.map(({ platform }) => (
                  <EmptyListItem
                    key={platform}
                    onClick={this.handleOpen}
                    name={platformDisplayInfo[platform].name}
                  />
                ))}
              </ul>
            </>
          ),
          static: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.sociallinks.social.links'])}
              />
              <ul className="list-unstyled">
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
              </ul>
            </>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.sociallinks.social.links'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilitySocialLinks !== null}
                visibility={visibilitySocialLinks}
              />
              <ul className="list-unstyled">
                {socialLinks.map(({ platform, socialLink }) => (
                  <EditableListItem
                    key={platform}
                    platform={platform}
                    name={platformDisplayInfo[platform].name}
                    url={socialLink}
                    onClickEmptyContent={this.handleOpen}
                  />
                ))}
              </ul>
            </>
          ),
          editing: (
            <div role="dialog" aria-labelledby="social-links-label">
              <form aria-labelledby="editing-form" onSubmit={this.handleSubmit}>
                <EditableItemHeader
                  headingId="social-links-label"
                  content={intl.formatMessage(messages['profile.sociallinks.social.links'])}
                />
                {/* TODO: Replace this alert with per-field errors. Needs API update. */}
                <div id="social-error-feedback">
                  {error !== null
                    ? (
                      <Alert variant="danger" dismissible={false} show>
                        {error}
                      </Alert>
                    ) : null}
                </div>
                <ul className="list-unstyled">
                  {socialLinks.map(({ platform, socialLink }) => (
                    <EditingListItem
                      key={platform}
                      name={platformDisplayInfo[platform].name}
                      platform={platform}
                      value={socialLink}
                      /* TODO: Per-field errors: error={error !== null ? error[platform] : null} */
                      onChange={this.handleChange}
                    />
                  ))}
                </ul>
                <FormControls
                  visibilityId="visibilitySocialLinks"
                  saveState={saveState}
                  visibility={visibilitySocialLinks}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
        }}
      />
    );
  }
}

SocialLinks.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })).isRequired,
  draftSocialLinksByPlatform: PropTypes.objectOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibilitySocialLinks: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

SocialLinks.defaultProps = {
  editMode: 'static',
  saveState: null,
  draftSocialLinksByPlatform: {},
  visibilitySocialLinks: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(SocialLinks));
