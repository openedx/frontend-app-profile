import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { Hyperlink } from '@edx/paragon';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import Visibility from './Visibility';

function SocialLinks({
  links,
  visibility,
  ...editableContentProps
}) {
  const linkKeys = Object.keys(links);

  return (
    <EditableContent
      {...editableContentProps}
      values={{
        links,
        visibility,
      }}
      renderStatic={() => (
        <React.Fragment>
          <h3>Social Links</h3>
          <dl>
            {linkKeys.map(linkName => (
              <React.Fragment key={linkName}>
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
      renderEditable={onClickEdit => (
        <React.Fragment>
          <h3>Social Links <EditButton onClick={onClickEdit} /> <br /><Visibility to="Everyone" /></h3>
          <dl>
            {linkKeys.map(linkName => (
              <React.Fragment key={linkName}>
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
      renderEditing={(state, setState) => ( // eslint-disable-line no-unused-vars
        <React.Fragment>
          <h3>Social Links</h3>
          <dl>
            {linkKeys.map(linkName => (
              <React.Fragment key={linkName}>
                <dt>{links[linkName].title}</dt>
                <dd>
                  <Input defaultValue={links[linkName].url} type="text" name="text" id="exampleText" />
                </dd>
              </React.Fragment>
            ))}
          </dl>
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
  visibility: PropTypes.oneOf('Everyone', 'Just me'),
};

SocialLinks.defaultProps = {
  links: {},
  visibility: 'Everyone',
};
