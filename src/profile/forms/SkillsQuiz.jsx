import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';
import { Form } from '@edx/paragon';

import messages from './SkillsQuiz.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Constants
import { GOALS } from '../data/constants';

// Selectors
import { editableFormSelector } from '../data/selectors';

class SkillsQuiz extends React.Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
  }

  handleChange(e) {
    const {
      name,
      value,
    } = e.target;
    this.props.changeHandler(name, value);
  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.submitHandler(this.props.formId);
  }

  handleClose() {
    this.props.closeHandler(this.props.formId);
  }

  handleOpen() {
    this.props.openHandler(this.props.formId);
  }

  render() {
    console.log("render in SkillsQuiz.jsx");
    console.log(this.props);
    const {
      skillsQuiz, formId, editMode, saveState, error, intl,
    } = this.props;

    return (
      <div className="mb-5">
        <label className="edit-section-header">
          {intl.formatMessage(messages['profile.recommendations.goals.label'])}
        </label>
        <p classname="h5">
          {intl.formatMessage(get(
            messages,
            `profile.recommendations.goals.${skillsQuiz.goal}`,
            messages['profile.recommendations.goals.empty'],
          ))}
        </p>
      </div>
    );
  }
}

SkillsQuiz.propTypes = {
  formId: PropTypes.string.isRequired,

  // From Selector
  skillsQuiz: PropTypes.object,
  visibilitySkillsQuiz: PropTypes.oneOf(['private', 'all_users']),
  editMode: PropTypes.oneOf(['editing', 'editable', 'empty', 'static']),
  saveState: PropTypes.string,
  error: PropTypes.string,

  // Actions
  changeHandler: PropTypes.func.isRequired,
  submitHandler: PropTypes.func.isRequired,
  closeHandler: PropTypes.func.isRequired,
  openHandler: PropTypes.func.isRequired,

  // i18n
  intl: intlShape.isRequired,
};

SkillsQuiz.defaultProps = {
  editMode: 'static',
  saveState: null,
  skillsQuiz: {},
  visibilitySkillsQuiz: null,
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(SkillsQuiz));
