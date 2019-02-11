import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableItemHeader from './EditableItemHeader';
import EditControls from './EditControls';
import EditableContent from './EditableContent';


class FullName extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      fullName: props.fullName,
      visibility: props.visibility,
    };

    this.onClickEdit = () => { this.props.onEdit(this.props.name); };
    this.onClickSave = () => {
      this.props.onSave(this.props.name, {
        fullName: this.state.fullName,
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
              content="Full Name"
            />
            <Input
              defaultValue={this.props.fullName}
              type="text"
              name="fullName"
              id="fullName"
              onChange={(e) => {
                this.setState({ fullName: e.target.value });
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
              content="Full Name"
              showEditButton
              onClickEdit={this.onClickEdit}
              showVisibility
              visibility={this.props.visibility}
            />
            <h5>{this.props.fullName}</h5>
          </React.Fragment>
        );

      case 'static':
      default:
        return (
          <React.Fragment key="static">
            <EditableItemHeader
              content="Full Name"
            />
            <h5>{this.props.fullName}</h5>
          </React.Fragment>
        );
    }
  }
  render() {
    return (
      <EditableContent>{this.renderMode()}</EditableContent>
    );
  }
}


export default FullName;


FullName.propTypes = {
  name: PropTypes.string.isRequired,
  fullName: PropTypes.string,
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
  mode: PropTypes.oneOf(['static', 'editable', 'editing']),
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
};

FullName.defaultProps = {
  fullName: null,
  visibility: 'Everyone',
  mode: 'editable',
  saveState: null,
};
