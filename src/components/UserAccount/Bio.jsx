import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditButton from './EditButton';
import Visibility from './Visibility';
import TransitionReplace from './TransitionReplace';
import EditControls from './EditControls';


class Bio extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      values: {
        bio: props.bio,
        visibility: props.visibility,
      },
    };

    this.renderModes = {
      editing: this.renderEditing.bind(this),
      editable: this.renderEditable.bind(this),
      static: this.renderStatic.bind(this),
    };

    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
  }

  onClickEdit() {
    this.props.onEdit(this.props.name);
  }

  onClickSave() {
    this.props.onSave(this.props.name, this.state.values);
  }

  onClickCancel() {
    this.props.onCancel(this.props.name);
  }

  renderStatic() {
    return (
      <React.Fragment key="static">
        <h3>{this.props.title}</h3>
        <p>{this.props.bio}</p>
      </React.Fragment>
    );
  }

  renderEditable() {
    return (
      <React.Fragment key="editable">
        <h3>
          {this.props.title}
          <EditButton onClick={this.onClickEdit} /> <br />
          <Visibility to={this.props.visibility} />
        </h3>
        <p>{this.props.bio}</p>
      </React.Fragment>
    );
  }

  renderEditing() {
    return (
      <React.Fragment key="editing">
        <h3>{this.props.title}</h3>
        <Input
          defaultValue={this.props.bio}
          type="textarea"
          name="text"
          id="exampleText"
          onChange={(e) => {
            this.setState({
              values: {
                bio: e.target.value,
                visibility: this.state.values.visibility,
              },
            });
          }}
        />
        <EditControls
          onCancel={this.onClickCancel}
          onSave={this.onClickSave}
          visibility={this.state.values.visibility}
          onVisibilityChange={(e) => {
            this.setState({
              values: {
                bio: this.state.values.bio,
                visibility: e.target.value,
              },
            });
          }}
        />
      </React.Fragment>
    );
  }

  render() {
    return (
      <TransitionReplace>
        {this.renderModes[this.props.mode]()}
      </TransitionReplace>
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
};

Bio.defaultProps = {
  bio: '',
  title: 'About',
  visibility: 'Everyone',
  mode: 'editable',
};
