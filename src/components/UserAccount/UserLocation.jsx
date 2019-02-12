import React from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';

import EditableItemHeader from './EditableItemHeader';
import EditControls from './EditControls';
import EditableContent from './EditableContent';
import EmptyContent from './EmptyContent';

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
            <EditableItemHeader
              content="Location"
            />
            <Input
              defaultValue={this.props.userLocation}
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
                <option key={countryKey} value={countryKey}>{ALL_COUNTRIES[countryKey]}</option>
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
              content="Location"
              showEditButton
              onClickEdit={this.onClickEdit}
              showVisibility
              visibility={this.props.visibility}
            />
            {
              this.props.userLocation ? (
                <h5>{ALL_COUNTRIES[this.props.userLocation]}</h5>
              ) : (
                <EmptyContent onClick={this.onClickEdit}>
                  Add location
                </EmptyContent>
              )
            }
          </React.Fragment>
        );

      case 'static':
      default:
        return (
          <React.Fragment key="static">
            <EditableItemHeader
              content="Location"
            />
            <h5>{ALL_COUNTRIES[this.props.userLocation]}</h5>
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
