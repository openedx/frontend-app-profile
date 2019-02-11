import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import { Hyperlink } from '@edx/paragon';

import EditButton from './EditButton';
import Visibility from './Visibility';
import TransitionReplace from './TransitionReplace';
import EditControls from './EditControls';


class SocialLinks extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      socialLinks: props.socialLinks,
      visibility: props.visibility,
    };

    this.onClickEdit = () => { this.props.onEdit(this.props.name); };
    this.onClickSave = () => {
      this.props.onSave(this.props.name, {
        socialLinks: this.state.socialLinks,
        visibility: this.state.visibility,
      });
    };
    this.onClickCancel = () => { this.props.onCancel(this.props.name); };
  }

  renderMode() {
    const { socialLinks } = this.props;
    const linkKeys = Object.keys(socialLinks);

    switch (this.props.mode) {
      case 'editing':
        return (
          <React.Fragment key="editing">
            <h3>Social Links</h3>
            <dl>
              {linkKeys.map(linkName => (
                <React.Fragment key={linkName}>
                  <dt>{socialLinks[linkName].title}</dt>
                  <dd>
                    <Input
                      defaultValue={this.state.socialLinks[linkName].url}
                      type="text"
                      name={linkName}
                      id="exampleText"
                      onChange={(e) => {
                        const newState = { ...this.state.socialLinks };
                        newState[e.target.name].url = e.target.value;
                        newState[e.target.name].display = e.target.value;
                        this.setState({ socialLinks: newState });
                      }}
                    />
                  </dd>
                </React.Fragment>
              ))}
            </dl>
            <EditControls
              onCancel={this.onClickCancel}
              onSave={this.onClickSave}
              saveState={this.props.saveState}
              visibility={this.state.visibility}
              onVisibilityChange={(e) => {
                this.setState({
                  visibility: e.target.value,
                });
              }}
            />
          </React.Fragment>
        );

      case 'editable':
        return (
          <React.Fragment key="editable">
            <h3>Social Links <EditButton onClick={this.onClickEdit} /> <br /><Visibility to="Everyone" /></h3>
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
        );

      case 'static':
      default:
        return (
          <React.Fragment key="static">
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
        );
    }
  }
  render() {
    return (
      <TransitionReplace>{this.renderMode()}</TransitionReplace>
    );
  }
}


export default SocialLinks;


SocialLinks.propTypes = {
  name: PropTypes.string.isRequired,
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
  mode: PropTypes.oneOf(['static', 'editable', 'editing']),
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
};

SocialLinks.defaultProps = {
  socialLinks: {},
  visibility: 'Everyone',
  mode: 'editable',
  saveState: null,
};
