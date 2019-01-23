import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { Hyperlink } from '@edx/paragon';

import EditableContent from './EditableContent';
import EditButton from './EditButton';
import Visibility from './Visibility';

function SocialLinks({
  socialLinks,
  visibility,
  ...editableContentProps
}) {
  const linkKeys = Object.keys(socialLinks);

  return (
    <EditableContent
      {...editableContentProps}
      values={{
        socialLinks,
        visibility,
      }}
      renderStatic={() => (
        <React.Fragment>
          <h3>Social Links</h3>
          <dl>
            {linkKeys.map(linkName => (
              <React.Fragment key={linkName}>
                <dt>{socialLinks[linkName].title}</dt>
                <dd>
                  <Hyperlink
                    className="word-break-all"
                    destination={socialLinks[linkName].url}
                    content={socialLinks[linkName].display}
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
                <dt>{socialLinks[linkName].title}</dt>
                <dd>
                  <Hyperlink
                    className="word-break-all"
                    destination={socialLinks[linkName].url}
                    content={socialLinks[linkName].display}
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
                <dt>{socialLinks[linkName].title}</dt>
                <dd>
                  <Input
                    defaultValue={state.socialLinks[linkName].url}
                    type="text"
                    name={linkName}
                    id="exampleText"
                    onChange={(e) => {
                      const newState = { ...state.socialLinks };
                      newState[e.target.name].url = e.target.value;
                      newState[e.target.name].display = e.target.value;
                      setState({ socialLinks: newState });
                    }}
                  />
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
  socialLinks: PropTypes.shape({
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
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
};

SocialLinks.defaultProps = {
  socialLinks: {},
  visibility: 'Everyone',
};
