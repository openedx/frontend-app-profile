import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input, FormFeedback } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

import FormControls from './elements/FormControls';
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
  }

  onSave() {
    const values = this.props.platforms.filter(({ key }) => typeof this.state[key] !== 'undefined').map(({ key }) => ({
      platform: key,
      socialLink: this.state[key],
    }));

    this.props.onSave('socialLinks', values);
  }

  onEdit() {
    this.props.onEdit('socialLinks');
  }

  render() {
    const {
      platforms,
      socialLinks,
      editMode,
      visibility,
      saveState,
      onCancel,
      onChange,
      onSubmit,
      errors,
    } = this.props;
    const { onEdit } = this;
    const socialLinksMap = socialLinks.reduce((acc, { platform, socialLink }) => {
      acc[platform] = socialLink;
      return acc;
    }, {});
    const isEmpty = socialLinks && socialLinks.length > 0;

    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit('socialLinks');
    };
    const handleChange = (e) => {
      const { name, value } = e.target;
      onChange({ name, value, namespace: 'socialLinks' });
    };

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          empty: (
            <ul className="list-unstyled">
              {platforms.map(({ key, name }) => (
                <EmptyListItem
                  key={key}
                  onClick={onEdit}
                  name={name}
                />
              ))}
            </ul>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content="Social Links" />
              <ul className="list-unstyled">
                {platforms.filter(({ platform }) => socialLinksMap[platform] != null)
                  .map(({ platform, name }) => (
                    <StaticListItem
                      key={platform}
                      name={name}
                      url={socialLinksMap[platform]}
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
            <Form onSubmit={handleSubmit} onChange={handleChange}>
              <EditableItemHeader content="Social Links" />
              <ul className="list-unstyled">
                {platforms.map(({ key, name }) => (
                  <EditingListItem
                    key={key}
                    name={name}
                    platform={key}
                    defaultValue={socialLinksMap[key]}
                    error={errors[key]}
                  />
                ))}
              </ul>
              <FormControls
                saveState={saveState}
                onCancel={() => onCancel('socialLinks')}
                visibility={visibility}
                visibilityName="visibility.socialLinks"
              />
            </Form>
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
  onSubmit: PropTypes.func.isRequired,
  saveState: PropTypes.string,
  errors: PropTypes.shape({
    twitter: PropTypes.string,
    facebook: PropTypes.string,
    linkedin: PropTypes.string,
  }),
};
SocialLinks.defaultProps = {
  socialLinks: [],
  platforms: [
    { key: 'twitter', name: 'Twitter' },
    { key: 'linkedin', name: 'LinkedIn' },
    { key: 'facebook', name: 'Facebook' },
  ],
  errors: null,
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
  url,
  platform,
  onClickEmptyContent,
  name,
}) {
  const linkDisplay = (url != null && url !== '') ?
    <SocialLink name={name} url={url} platform={platform} /> :
    <EmptyContent onClick={onClickEmptyContent}>Add {name}</EmptyContent>;

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
  error,
}) {
  return (
    <li className="form-group">
      <h6>{name}</h6>
      <Input
        type="text"
        name={platform}
        defaultValue={defaultValue}
        invalid={error != null}
      />
      <FormFeedback>{error}</FormFeedback>
    </li>
  );
}

EditingListItem.propTypes = {
  platform: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  name: PropTypes.string.isRequired,
  error: PropTypes.string,
};
EditingListItem.defaultProps = {
  defaultValue: null,
  error: null,
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
