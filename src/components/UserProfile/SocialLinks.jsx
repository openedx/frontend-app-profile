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
    const values = this.props.platforms.filter(({ key }) => typeof this.state[key] !== 'undefined').map(({ key }) => ({
      platform: key,
      socialLink: this.state[key],
    }));

    this.props.onSave('socialLinks', values);
  }

  onEdit() {
    this.props.onEdit('socialLinks');
  }

  onInputChange(platform, value) {
    console.log(platform, value)
    this.setState({ [platform]: value});
  }

  renderEmpty() {
    const { platforms } = this.props;
    const onEdit = this.onEdit;

    return (
      <ul className="list-unstyled">
        {platforms.map(({ key, name }) => (
          <EmptyListItem
            key={key}
            onClick={onEdit}
            name={name}
          />
        ))}
      </ul>
    );
  }

  renderStatic(linkValues) {
    const { platforms } = this.props;
    const links = platforms.filter(({ key }) => Boolean(linkValues[key]));

    return (
      <React.Fragment>
        <EditableItemHeader content="Social Links" />
        <ul className="list-unstyled">
          {links.map(({ key, name}) => (
            <StaticListItem
              key={key}
              name={name}
              url={linkValues[key]}
              platform={key}
            />
          ))}
        </ul>
      </React.Fragment>
    );
  }

  renderEditable(linkValues, isEmpty) {
    const { visibility, platforms, showVisibility } = this.props;
    const onEdit = this.onEdit;

    return (
      <React.Fragment>
        <EditableItemHeader
          content="Social Links"
          showEditButton
          onClickEdit={onEdit}
          showVisibility={showVisibility}
          visibility={visibility}
        />
        <ul className="list-unstyled">
          {platforms.map(({ key, name }) => (
            <EditableListItem
              key={key}
              platform={key}
              name={name}
              url={linkValues[key]}
              onEdit={onEdit}
            />
          ))}
        </ul>
      </React.Fragment>
    );
  }

  renderEditing(linkValues) {
    const { platforms, saveState, visibility, onVisibilityChange, onCancel } = this.props;
    const onInputChange = this.onInputChange;

    return (
      <React.Fragment>
        <EditableItemHeader content="Social Links" />
        <ul className="list-unstyled">
          {platforms.map(({ key, name }) => (
            <EditingListItem
              key={key}
              name={name} 
              platform={key}
              defaultValue={linkValues[key]}
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
    );
  }

  render() {
    const { socialLinks, editMode } = this.props;
    const socialLinksObj = socialLinks.reduce((acc, { platform, socialLink }) => {
      acc[platform] = socialLink;
      return acc;
    }, {});
    const isEmpty = socialLinks && socialLinks.length > 0;

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          empty: this.renderEmpty(),
          static: this.renderStatic(socialLinksObj),
          editing: this.renderEditing(socialLinksObj),
          editable: this.renderEditable(socialLinksObj, isEmpty),
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

function EditableListItem({ url, platform, onEdit, name }) {
  const linkDisplay = url != null ?
    <SocialLink name={name} url={url} platform={platform} /> :
    <EmptyContent onClick={onEdit}>Add {name}</EmptyContent>;

  return <li className="form-group">{linkDisplay}</li>;
}

function EditingListItem({ platform, name, defaultValue, onChange }) {
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

function EmptyListItem({ onClick, name }) {
  return (
    <li className="mb-4">
      <EmptyContent onClick={onClick}>Add {name}</EmptyContent>
    </li>
  );
}

function StaticListItem({ name, url, platform }) {
  return (
    <li className="mb-2">
      <SocialLink name={name} url={url} platform={platform} />
    </li>
  );
}
