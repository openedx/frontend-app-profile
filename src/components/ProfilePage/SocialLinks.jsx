import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'reactstrap';
import { connect } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTwitter, faFacebook, faLinkedin } from '@fortawesome/free-brands-svg-icons';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Selectors
import { editableFormSelector } from '../../selectors/ProfilePageSelector';

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

class SocialLinks extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    if (name !== 'visibility') {
      const updatedList = this.props.committedValue.map((socialLink) => {
        if (socialLink.platform === name) {
          return { platform: name, social_link: value };
        }
        return socialLink;
      });
      this.props.changeHandler(this.props.formId, 'socialLinks', updatedList);
    } else {
      this.props.changeHandler(this.props.formId, name, value);
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

  render() {
    const {
      formId, value: values, visibility, editMode, saveState, error,
    } = this.props;

    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          empty: (
            <ul className="list-unstyled">
              {values.map(({ platform }) => (
                <EmptyListItem
                  key={platform}
                  onClick={this.handleOpen}
                  name={platformDisplayInfo[platform].name}
                />
              ))}
            </ul>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content="Social Links" />
              <ul className="list-unstyled">
                {values.map(({ platform, social_link: socialLink }) => (
                  <StaticListItem
                    key={platform}
                    name={platformDisplayInfo[platform].name}
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
                onClickEdit={this.handleOpen}
                showVisibility={visibility !== null}
                visibility={visibility}
              />
              <ul className="list-unstyled">
                {values.map(({ platform, social_link: socialLink }) => (
                  <EditableListItem
                    key={platform}
                    platform={platform}
                    name={platformDisplayInfo[platform].name}
                    url={socialLink}
                    onClickEmptyContent={this.handleOpen}
                  />
                ))}
              </ul>
            </React.Fragment>
          ),
          editing: (
            <Form onSubmit={this.handleSubmit}>
              <EditableItemHeader content="Social Links" />
              <ul className="list-unstyled">
                {values.map(({ platform, social_link: socialLink }) => (
                  <EditingListItem
                    key={platform}
                    name={platformDisplayInfo[platform].name}
                    platform={platform}
                    value={socialLink}
                    error={error}
                    onChange={this.handleChange}
                  />
                ))}
              </ul>
              <FormControls
                formId={formId}
                saveState={saveState}
                visibility={visibility}
                cancelHandler={this.handleClose}
                changeHandler={this.handleChange}
              />
            </Form>
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
  value: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  committedValue: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  visibility: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,
};

SocialLinks.defaultProps = {
  editMode: 'static',
  saveState: null,
  value: [],
  committedValue: [],
  visibility: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(SocialLinks);

function SocialLink({ url, name, platform }) {
  return (
    <a href={url} className="font-weight-bold">
      <FontAwesomeIcon className="mr-2" icon={platformDisplayInfo[platform].icon} />
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
  const linkDisplay = url != null ?
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
  value,
  onChange,
}) {
  return (
    <li className="form-group">
      <h6>{name}</h6>
      <Input
        type="text"
        name={platform}
        value={value}
        onChange={onChange}
      />
    </li>
  );
}

EditingListItem.propTypes = {
  platform: PropTypes.string.isRequired,
  value: PropTypes.string,
  name: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
};
EditingListItem.defaultProps = {
  value: null,
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
