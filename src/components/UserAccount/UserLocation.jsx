import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditButton from './EditButton';
import Visibility from './Visibility';
import TransitionReplace from './TransitionReplace';
import EditControls from './EditControls';

import { ALL_COUNTRIES } from '../../constants/countries';


class UserLocation extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      userLocation: props.userLocation,
      visibility: props.visibility,
    };

    this.onClickEdit = () => { this.props.onEdit(this.props.name); };
    this.onClickSave = () => {
      this.props.onSave(this.props.name, {
        userLocation: this.state.userLocation,
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
            <Input
              defaultValue={this.props.userLocation}
              value={this.state.userLocation}
              onChange={(e) => {
                this.setState({
                  userLocation: e.target.value,
                });
              }}
              className="w-100"
              type="select"
              name="select"
            >
              {Object.keys(ALL_COUNTRIES).map(countryKey => (
                <option value={countryKey}>{ALL_COUNTRIES[countryKey]}</option>
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
            {this.props.userLocation}
            <EditButton onClick={this.onClickEdit} /> <br />
            <Visibility to={this.props.visibility} />
          </React.Fragment>
        );

      case 'static':
      default:
        return (
          <React.Fragment key="static">
            {this.props.userLocation}
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


export default UserLocation;


UserLocation.propTypes = {
  name: PropTypes.string.isRequired,
  userLocation: PropTypes.string,
  visibility: PropTypes.oneOf(['Everyone', 'Just me']),
  mode: PropTypes.oneOf(['static', 'editable', 'editing']),
  onEdit: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  saveState: PropTypes.oneOf([null, 'pending', 'complete', 'error']),
};

UserLocation.defaultProps = {
  userLocation: null,
  visibility: 'Everyone',
  mode: 'editable',
  saveState: null,
};
