import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from '@edx/frontend-platform/i18n';
import get from 'lodash.get';
import { Form } from '@openedx/paragon';

import messages from './Education.messages';

// Components
import FormControls from './elements/FormControls';
import EditableItemHeader from './elements/EditableItemHeader';
import EmptyContent from './elements/EmptyContent';
import SwitchContent from './elements/SwitchContent';

// Constants
import { EDUCATION_LEVELS } from '../data/constants';

// Selectors
import { editableFormSelector } from '../data/selectors';

class Education extends React.Component {
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
      formId, levelOfEducation, visibilityLevelOfEducation, editMode, saveState, error, intl,
    } = this.props;

    return (
      <SwitchContent
        className="mb-5"
        expression={editMode}
        cases={{
          editing: (
            <div role="dialog" aria-labelledby={`${formId}-label`}>
              <form onSubmit={this.handleSubmit}>
                <Form.Group
                  controlId={formId}
                  isInvalid={error !== null}
                >
                  <label className="edit-section-header" htmlFor={formId}>
                    {intl.formatMessage(messages['profile.education.education'])}
                  </label>
                  <select
                    data-hj-suppress
                    className="form-control"
                    id={formId}
                    name={formId}
                    value={levelOfEducation}
                    onChange={this.handleChange}
                  >
                    <option value="">&nbsp;</option>
                    {EDUCATION_LEVELS.map(level => (
                      <option key={level} value={level}>
                        {intl.formatMessage(get(
                          messages,
                          `profile.education.levels.${level}`,
                          messages['profile.education.levels.o'],
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
                  visibilityId="visibilityLevelOfEducation"
                  saveState={saveState}
                  visibility={visibilityLevelOfEducation}
                  cancelHandler={this.handleClose}
                  changeHandler={this.handleChange}
                />
              </form>
            </div>
          ),
          editable: (
            <>
              <EditableItemHeader
                content={intl.formatMessage(messages['profile.education.education'])}
                showEditButton
                onClickEdit={this.handleOpen}
                showVisibility={visibilityLevelOfEducation !== null}
                visibility={visibilityLevelOfEducation}
              />
              <p data-hj-suppress className="h5">
                {intl.formatMessage(get(
                  messages,
                  `profile.education.levels.${levelOfEducation}`,
                  messages['profile.education.levels.o'],
                ))}
              </p>
            </>
          ),
          empty: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.education.education'])} />
              <EmptyContent onClick={this.handleOpen}>
                <FormattedMessage
                  id="profile.education.empty"
                  defaultMessage="Add education"
                  description="instructions when the user doesn't have their level of education set"
                />
              </EmptyContent>
            </>
          ),
          static: (
            <>
              <EditableItemHeader content={intl.formatMessage(messages['profile.education.education'])} />
              <p data-hj-suppress className="h5">
                {intl.formatMessage(get(
                  messages,
                  `profile.education.levels.${levelOfEducation}`,
                  messages['profile.education.levels.o'],
                ))}
              </p>
            </>
          ),
        }}
      />
    );
  }
}

Education.propTypes = {
  // It'd be nice to just set this as a defaultProps...
  // except the class that comes out on the other side of react-redux's
  // connect() method won't have it anymore. Static properties won't survive
  // through the higher order function.
  formId: PropTypes.string.isRequired,

  // From Selector
  levelOfEducation: PropTypes.string,
  visibilityLevelOfEducation: PropTypes.oneOf(['private', 'all_users']),
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

Education.defaultProps = {
  editMode: 'static',
  saveState: null,
  levelOfEducation: null,
  visibilityLevelOfEducation: 'private',
  error: null,
};

export default connect(
  editableFormSelector,
  {},
)(injectIntl(Education));
