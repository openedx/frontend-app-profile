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
    const {
      goal, visibilitySkillsQuiz, formId, editMode, saveState, error, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-5"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <p>{console.log(goal)}</p>
              <form onSubmit={this.handleSubmit}>
                <Form.Group
                  controlId={formId}
                  isInvalid={error !== null}
                >
                  <label className="edit-section-header" htmlFor={formId}>
                    {intl.formatMessage(messages['profile.recommendations.goals.label'])}
                  </label>
                  <select
                    data-hj-suppress
                    className="form-control"
                    id={formId}
                    name={formId}
                    value={goal}
                    onChange={this.handleChange}
                  >
                    <option value="">&nbsp;</option>
                    {GOALS.map(level => (
                        <option key={level} value={level}>
                          {intl.formatMessage(get(
                            messages,
                            `profile.recommendations.goals.${goal}`,
                            messages['profile.recommendations.goals.other'],
                          ))}
                        </option>
                    ))}
                  </select>
                  {error !== null && (
                    <Form.Control.Feedback hasIcon={false}>
                      {error}
                    </Form.Control.Feedback>
                  )}
                </Form.Group>
                <FormControls
                  visibilityId="visibilitySkillsQuiz"
                  saveState={saveState}
                  visibility={visibilitySkillsQuiz}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.recommendations.goals.label'])}
              />
              <p data-hj-suppress className="h5">
                {intl.formatMessage(get(
                  messages,
                  `profile.recommendations.goals.${goal}`,
                  messages['profile.recommendations.goals.other'],
                ))}
              </p>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.recommendations.goals.label'])}
              />
              <EmptyContent onClick={this.handleOpen}>
                {intl.formatMessage(messages['profile.recommendations.goals.empty'])}
              </EmptyContent>
            </>
          ),
          static: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.recommendations.goals.label'])}
              />
              <p data-hj-suppress className="h5">
                {intl.formatMessage(get(
                  messages,
                  `profile.recommendations.goals.other`,
                  messages['profile.recommendations.goals.other'],
                ))}
              </p>
            </>
          ),
        }}
      />
    );
  }
}

SkillsQuiz.propTypes = {
  formId: PropTypes.string.isRequired,

  // From Selector
  goal: PropTypes.string,
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
  goal: null,
  visibilitySkillsQuiz: null,
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(SkillsQuiz));
