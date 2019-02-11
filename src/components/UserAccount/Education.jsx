import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableItemHeader from './EditableItemHeader';
import EditControls from './EditControls';
import EditableContent from './EditableContent';

import EDUCATION from '../../constants/education';


class Education extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      education: props.education,
      visibility: props.visibility,
    };

    this.onClickEdit = () => { this.props.onEdit(this.props.name); };
    this.onClickSave = () => {
      this.props.onSave(this.props.name, {
        education: this.state.education,
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
              content="Education"
            />
            <Input
              value={this.state.education || this.props.education}
              onChange={(e) => {
                this.setState({
                  education: e.target.value,
                });
              }}
              className="w-100"
              type="select"
              name="select"
            >
              {Object.keys(EDUCATION).map(educationKey => (
                <option key={educationKey} value={educationKey}>{EDUCATION[educationKey]}</option>
              ))}
            </Input>
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
              content="Education"
              showEditButton
              onClickEdit={this.onClickEdit}
              showVisibility
              visibility={this.props.visibility}
            />
            <h5>{EDUCATION[this.props.education]}</h5>
          </React.Fragment>
        );

      case 'static':
      default:
        return (
          <React.Fragment key="static">
            <EditableItemHeader
              content="Education"
            />
            <h5>{EDUCATION[this.props.education]}</h5>
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


export default Education;


Education.propTypes = {
  name: PropTypes.string.isRequired,
  education: PropTypes.oneOf(Object.keys(EDUCATION)),
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
  mode: PropTypes.oneOf(['static', 'editable', 'editing']),
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
};

Education.defaultProps = {
  education: '',
  visibility: 'Everyone',
  mode: 'editable',
  saveState: null,
};
