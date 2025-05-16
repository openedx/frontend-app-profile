import React from 'react';
import PropTypes from 'prop-types';
import { Alert } from '@openedx/paragon';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import classNames from 'classnames';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../data/selectors';
import messages from './SocialLinks.messages';

const platformDisplayInfo = {
  facebook: {
    icon: faFacebook,
    name: 'Facebook',
  },
  twitter: {
    icon: faTwitter,
    name: 'X',
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

const SocialLinks = ({
  formId,
  socialLinks,
  draftSocialLinksByPlatform,
  visibilitySocialLinks,
  editMode,
  saveState,
  error,
  changeHandler,
  submitHandler,
  closeHandler,
  openHandler,
  intl,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name !== 'visibilitySocialLinks') {
      changeHandler(
        'socialLinks',
        mergeWithDrafts({
          platform: name,
          socialLink: value,
        }),
      );
    } else {
      changeHandler(name, value);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitHandler(formId);
  };

  const handleClose = () => {
    closeHandler(formId);
  };

  const handleOpen = () => {
    openHandler(formId);
  };

  const mergeWithDrafts = (newSocialLink) => {
    const knownPlatforms = ['twitter', 'facebook', 'linkedin'];
    const updated = [];
    knownPlatforms.forEach((platform) => {
      if (newSocialLink.platform === platform) {
        updated.push(newSocialLink);
      } else if (draftSocialLinksByPlatform[platform] !== undefined) {
        updated.push(draftSocialLinksByPlatform[platform]);
      }
    });
    return updated;
  };

  return (
    <SwitchContent
      className="mb-5"
      expression={editMode}
      cases={{
        empty: (
          <div>
            <div>
              {socialLinks.map(({ platform }) => (
                <div key={platform} className="mb-4">
                  <p data-hj-suppress className="h5 font-weight-bold">
                    {platformDisplayInfo[platform].name}
                  </p>
                  <EmptyContent onClick={handleOpen}>
                    <FormattedMessage
                      id="profile.sociallinks.add"
                      defaultMessage="Add {network} profile"
                      values={{
                        network: platformDisplayInfo[platform].name,
                      }}
                      description="{network} is the name of a social network such as Facebook or Twitter"
                    />
                  </EmptyContent>
                </div>
              ))}
            </div>
          </div>
        ),
        static: (
          <div>
            <div>
              {socialLinks
                .filter(({ socialLink }) => Boolean(socialLink))
                .map(({ platform, socialLink }) => (
                  <div key={platform} className="mb-4">
                    <p data-hj-suppress className="h5 font-weight-bold">
                      {platformDisplayInfo[platform].name}
                    </p>
                    <EditableItemHeader
                      content={socialLink}
                      contentPrefix={`${platformDisplayInfo[platform].name}: `}
                    />
                  </div>
                ))}
            </div>
          </div>
        ),
        editable: (
          <div>
            <div>
              {socialLinks.map(({ platform, socialLink }) => (
                <div key={platform} className="mb-4">
                  <p data-hj-suppress className="h5 font-weight-bold">
                    {platformDisplayInfo[platform].name}
                  </p>
                  {socialLink ? (
                    <EditableItemHeader
                      content={socialLink}
                      showEditButton
                      onClickEdit={handleOpen}
                      showVisibility={visibilitySocialLinks !== null}
                      visibility={visibilitySocialLinks}
                    />
                  ) : (
                    <EmptyContent onClick={handleOpen}>
                      Add {platformDisplayInfo[platform].name}
                    </EmptyContent>
                  )}
                </div>
              ))}
            </div>
          </div>
        ),
        editing: (
          <div role="dialog" aria-labelledby="social-links-label">
            <form onSubmit={handleSubmit}>
              {error !== null && (
                <div id="social-error-feedback">
                  <Alert variant="danger" dismissible={false} show>
                    {error}
                  </Alert>
                </div>
              )}
              <div>
                {socialLinks.map(({ platform, socialLink }) => (
                  <div key={platform} className="form-group mb-4">
                    <p data-hj-suppress className="h5 font-weight-bold">
                      {platformDisplayInfo[platform].name}
                    </p>
                    <input
                      className={classNames('form-control', { 'is-invalid': Boolean(error) })}
                      type="text"
                      id={`social-${platform}`}
                      name={platform}
                      value={socialLink || ''}
                      onChange={handleChange}
                      aria-describedby="social-error-feedback"
                    />
                  </div>
                ))}
              </div>
              <FormControls
                visibilityId="visibilitySocialLinks"
                saveState={saveState}
                visibility={visibilitySocialLinks}
                cancelHandler={handleClose}
                changeHandler={handleChange}
                submitHandler={handleSubmit}
              />
            </form>
          </div>
        ),
      }}
    />
  );
};

SocialLinks.propTypes = {
  formId: PropTypes.string.isRequired,
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
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
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
