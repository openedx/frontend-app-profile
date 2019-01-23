import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { Hyperlink } from '@edx/paragon';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import EditControls from './EditControls';
import Visibility from './Visibility';

function SocialLinks(props) {
  const {
    links,
    editMode,
    onEdit,
    onCancel,
    onSave,
  } = props;

  const linkNames = Object.keys(links);

  return (
    <EditableContent
      isEditing={editMode}
      disabled={false}
      renderStatic={() => (
        <React.Fragment>
          <h3>Social Links</h3>
          <dl>
            {linkNames.map(linkName => (
              <React.Fragment>
                <dt>{links[linkName].title}</dt>
                <dd>
                  <Hyperlink
                    className="word-break-all"
                    destination={links[linkName].url}
                    content={links[linkName].display}
                  />
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </React.Fragment>
      )}
      renderEditable={() => (
        <React.Fragment>
          <h3>Social Links <EditButton onClick={() => onEdit('socialLinks')} /> <br /><Visibility to="Everyone" /></h3>
          <dl>
            {linkNames.map(linkName => (
              <React.Fragment>
                <dt>{links[linkName].title}</dt>
                <dd>
                  <Hyperlink
                    className="word-break-all"
                    destination={links[linkName].url}
                    content={links[linkName].display}
                  />
                </dd>
              </React.Fragment>
            ))}
          </dl>
        </React.Fragment>
      )}
      renderEditing={() => (
        <React.Fragment>
          <h3>Social Links</h3>
          <dl>
            {linkNames.map(linkName => (
              <React.Fragment>
                <dt>{links[linkName].title}</dt>
                <dd>
                  <Input defaultValue={links[linkName].url} type="text" name="text" id="exampleText" />
                </dd>
              </React.Fragment>
            ))}
          </dl>
          <EditControls onCancel={onCancel} onSave={onSave} />
        </React.Fragment>
      )}
    />
  );
}


export default SocialLinks;

SocialLinks.propTypes = {
  links: PropTypes.shape({
    linkedIn: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      display: PropTypes.string,
    }),
    twitter: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      display: PropTypes.string,
    }),
    facebook: PropTypes.shape({
      title: PropTypes.string,
      url: PropTypes.string,
      display: PropTypes.string,
    }),
  }),
  editMode: PropTypes.bool,
  onEdit: PropTypes.func,
  onCancel: PropTypes.func,
  onSave: PropTypes.func,
};

SocialLinks.defaultProps = {
  links: {},
  editMode: false,
  onEdit: () => {},
  onCancel: () => {},
  onSave: () => {},
};
