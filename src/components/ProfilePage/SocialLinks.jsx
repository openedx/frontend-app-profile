import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import EditControls from './elements/EditControls';
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';
import EmptyContent from './elements/EmptyContent';

const brandIcons = {
  facebook: faFacebook,
  twitter: faTwitter,
  linkedin: faLinkedin,
};

class SocialLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onSave = this.onSave.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onInputChange = this.onInputChange.bind(this);
  }

  onSave() {
    const values = this.props.platforms
      .filter(({ key }) => typeof this.state[key] !== 'undefined')
      .map(({ key }) => ({
        platform: key,
        socialLink: this.state[key],
      }));

    this.props.onSave('socialLinks', values);
  }

  onEdit() {
    this.props.onEdit('socialLinks');
  }

  onInputChange(platform, value) {
    this.setState({ [platform]: value });
    this.props.onChange('socialLinks', this.state);
  }

  render() {
    const {
      platforms,
      socialLinks,
      editMode,
      visibility,
      saveState,
      onVisibilityChange,
      onCancel,
    } = this.props;
    const { onInputChange, onEdit } = this;
    const socialLinksMap = socialLinks.reduce((acc, { platform, socialLink }) => {
      acc[platform] = socialLink;
      return acc;
    }, {});
    const isEmpty = socialLinks && socialLinks.length > 0;

    const platformNames = {
      twitter: 'Twitter',
      linkedin: 'LinkedIn',
      facebook: 'Facebook',
    };

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          empty: (
            <ul className="list-unstyled">
              {platforms.map(({ key, name }) => (
                <EmptyListItem key={key} onClick={onEdit} name={name} />
              ))}
            </ul>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content="Social Links" />
              <ul className="list-unstyled">
                {socialLinks.map(({ platform, socialLink }) => (
                  <StaticListItem
                    key={platform}
                    name={platformNames[platform]}
                    url={socialLink}
                    platform={platform}
                  />
                ))}
              </ul>
            </React.Fragment>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content="Social Links"
                showEditButton
                onClickEdit={onEdit}
                showVisibility={isEmpty}
                visibility={visibility}
              />
              <ul className="list-unstyled">
                {platforms.map(({ key, name }) => (
                  <EditableListItem
                    key={key}
                    platform={key}
                    name={name}
                    url={socialLinksMap[key]}
                    onClickEmptyContent={onEdit}
                  />
                ))}
              </ul>
            </React.Fragment>
          ),
          editing: (
            <React.Fragment>
              <EditableItemHeader content="Social Links" />
              <ul className="list-unstyled">
                {platforms.map(({ key, name }) => (
                  <EditingListItem
                    key={key}
                    name={name}
                    platform={key}
                    defaultValue={socialLinksMap[key]}
                    onChange={onInputChange}
                  />
                ))}
              </ul>
              <EditControls
                onCancel={() => onCancel('socialLinks')}
                onSave={this.onSave}
                saveState={saveState}
                visibility={visibility}
                onVisibilityChange={e => onVisibilityChange('socialLinks', e.target.value)}
              />
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

SocialLinks.propTypes = {
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  platforms: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
  })),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  saveState: PropTypes.string,
};
SocialLinks.defaultProps = {
  socialLinks: [],
  platforms: [
    { key: 'twitter', name: 'Twitter' },
    { key: 'linkedin', name: 'LinkedIn' },
    { key: 'facebook', name: 'Facebook' },
  ],
  visibility: 'private',
  editMode: 'static',
  saveState: null,
};

export default SocialLinks;

function SocialLink({ url, name, platform }) {
  return (
    <a href={url} className="font-weight-bold">
      <FontAwesomeIcon className="mr-2" icon={brandIcons[platform]} />
      {name}
    </a>
  );
}

SocialLink.propTypes = {
  url: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
};

function EditableListItem({
  url, platform, onClickEmptyContent, name,
}) {
  const linkDisplay =
    url != null ? (
      <SocialLink name={name} url={url} platform={platform} />
    ) : (
      <EmptyContent onClick={onClickEmptyContent}>Add {name}</EmptyContent>
    );

  return <li className="form-group">{linkDisplay}</li>;
}

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

function EditingListItem({
  platform,
  name,
  defaultValue,
  onChange,
}) {
  return (
    <li className="form-group">
      <h6>{name}</h6>
      <Input
        type="text"
        defaultValue={defaultValue}
        onChange={e => onChange(platform, e.target.value)}
      />
    </li>
  );
}

EditingListItem.propTypes = {
  platform: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
EditingListItem.defaultProps = {
  defaultValue: null,
};

function EmptyListItem({ onClick, name }) {
  return (
    <li className="mb-4">
      <EmptyContent onClick={onClick}>Add {name}</EmptyContent>
    </li>
  );
}

EmptyListItem.propTypes = {
  name: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};

function StaticListItem({ name, url, platform }) {
  return (
    <li className="mb-2">
      <SocialLink name={name} url={url} platform={platform} />
    </li>
  );
}

StaticListItem.propTypes = {
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  platform: PropTypes.string.isRequired,
};
