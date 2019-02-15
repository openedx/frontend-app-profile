import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditControls from './elements/EditControls';
import EditableItemHeader from './elements/EditableItemHeader';
import SwitchContent from './elements/SwitchContent';
import EmptyContent from './elements/EmptyContent';


class SocialLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onSave = this.onSave.bind(this);
  }

  onSave() {
    const values = this.props.platforms.filter(({ key }) => typeof this.state[key] !== 'undefined').map(({ key }) => ({
      platform: key,
      socialLink: this.state[key],
    }));

    this.props.onSave('socialLinks', values);
  }

  render() {
    const {
      socialLinks,
      editMode,
      onEdit,
      onCancel,
      onVisibilityChange,
      saveState,
    } = this.props;

    const socialLinksObj = {};

    if (socialLinks !== null) {
      socialLinks.forEach(({ platform, socialLink }) => {
        socialLinksObj[platform] = socialLink;
      });
    }


    return (
      <SwitchContent
        className="mb-4"
        expression={editMode}
        cases={{
          editing: (
            <React.Fragment>
              <EditableItemHeader content="Social Links" />
              <ul className="list-unstyled">
                {this.props.platforms.map(({ key, name }) => (
                  <li key={key} className="form-group">
                    <h6>{name}</h6>
                    <Input
                      type="text"
                      defaultValue={socialLinksObj[key]}
                      onChange={(e) => {
                        this.setState({
                          [key]: e.target.value,
                        });
                      }}
                    />
                  </li>
                ))}
              </ul>
              <EditControls
                onCancel={() => onCancel('socialLinks')}
                onSave={this.onSave}
                saveState={saveState}
                visibility="Everyone"
                onVisibilityChange={e => onVisibilityChange('socialLinks', e.target.value)}
              />
            </React.Fragment>
          ),
          editable: (
            <React.Fragment>
              <EditableItemHeader
                content="Social Links"
                showEditButton
                onClickEdit={() => onEdit('socialLinks')}
                showVisibility={socialLinks && socialLinks.length > 0}
                visibility="Everyone"
              />
              <ul className="list-unstyled">
                {this.props.platforms.map(({ key, name }) => (
                  <li key={key} className="form-group">
                    {
                      socialLinksObj[key] ? (
                        <a href={socialLinksObj[key]}>{name}</a>
                      ) : (
                        <EmptyContent onClick={() => onEdit('socialLinks')}>Add {name}</EmptyContent>
                      )
                    }
                  </li>
                ))}
              </ul>
            </React.Fragment>
          ),
          empty: (
            <ul className="list-unstyled">
              {this.props.platforms.map(({ key, name }) => (
                <li key={key} className="mb-4">
                  <EmptyContent onClick={() => onEdit('socialLinks')}>Add {name}</EmptyContent>
                </li>
              ))}
            </ul>
          ),
          static: (
            <React.Fragment>
              <EditableItemHeader content="Social Links" />
              <ul>
                {this.props.platforms.map(({ key, name }) => {
                  if (!socialLinksObj[key]) return null;

                  return (
                    <li key={key}>
                      <a href={socialLinksObj[key]}>{name}</a>
                    </li>
                  );
                })}
              </ul>
            </React.Fragment>
          ),
        }}
      />
    );
  }
}

const sectionPropTypes = {
  editMode: PropTypes.string,
  onEdit: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onVisibilityChange: PropTypes.func.isRequired,
  saveState: PropTypes.string,
};

const sectionDefaultProps = {
  editMode: 'static',
  saveState: null,
};

SocialLinks.propTypes = {
  ...sectionPropTypes,
  socialLinks: PropTypes.arrayOf(PropTypes.shape({
    platform: PropTypes.string,
    socialLink: PropTypes.string,
  })),
  platforms: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
  })),
};

SocialLinks.defaultProps = {
  ...sectionDefaultProps,
  socialLinks: [],
  platforms: [
    { key: 'twitter', name: 'Twitter' },
    { key: 'linkedin', name: 'LinkedIn' },
    { key: 'facebook', name: 'Facebook' },
  ],
};

export default SocialLinks;
