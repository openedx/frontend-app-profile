import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableItemHeader from './EditableItemHeader';
import EditControls from './EditControls';
import TransitionReplace from './TransitionReplace';


class Bio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      bio: props.bio,
      visibility: props.visibility,
    };

    this.onClickEdit = () => { this.props.onEdit(this.props.name); };
    this.onClickSave = () => {
      this.props.onSave(this.props.name, {
        bio: this.state.bio,
        visibility: this.state.visibility,
      });
    };
    this.onClickCancel = () => { this.props.onCancel(this.props.name); };
  }

  renderMode() {
    switch (this.props.mode) {
      case 'editing':
        return (
          <React.Fragment key="editing">
            <EditableItemHeader
              content={this.props.title}
            />
            <Input
              defaultValue={this.props.bio}
              type="textarea"
              name="text"
              id="exampleText"
              onChange={(e) => {
                this.setState({
                  bio: e.target.value,
                });
              }}
            />
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
            <EditableItemHeader
              content={this.props.title}
              showEditButton
              onClickEdit={this.onClickEdit}
              showVisibility
              visibility={this.props.visibility}
            />
            <p>{this.props.bio}</p>
          </React.Fragment>
        );

      case 'static':
      default:
        return (
          <React.Fragment key="static">
            <EditableItemHeader
              content={this.props.title}
            />
            <p>{this.props.bio}</p>
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


export default Bio;


Bio.propTypes = {
  name: PropTypes.string.isRequired,
  bio: PropTypes.string,
  title: PropTypes.string,
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
  mode: PropTypes.oneOf(['static', 'editable', 'editing']),
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
};

Bio.defaultProps = {
  bio: '',
  title: 'About Me',
  visibility: 'Everyone',
  mode: 'editable',
  saveState: null,
};
