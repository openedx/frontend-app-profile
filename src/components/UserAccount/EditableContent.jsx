import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { CSSTransition } from 'react-transition-group';
import EditControls from './EditControls';

class EditableContent extends React.Component {
  constructor(props) {
    super(props);

    this.container = React.createRef();
    this.content = React.createRef();

    this.state = {
      height: null,
      values: null, // maybe should do this on change to editing mode not on mount?
      containerRef: this.container,
      // Mirroring props in state as described here:
      // https://github.com/reactjs/rfcs/blob/master/text/0006-static-lifecycle-methods.md#state-derived-from-propsstate
      mirroredMode: props.mode,
    };

    this.onTransitionEnd = this.onTransitionEnd.bind(this);
    this.setValueState = this.setValueState.bind(this);
    this.onClickEdit = this.onClickEdit.bind(this);
    this.onClickSave = this.onClickSave.bind(this);
    this.onClickCancel = this.onClickCancel.bind(this);
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (prevState.mirroredMode !== nextProps.mode) {
      return {
        // Set the height to its current height pixels before this render
        // The height will then be changed to its next height in pixels ater render (didUpdate)
        height: prevState.containerRef.current.offsetHeight,
        mirroredMode: nextProps.mode,
      };
    }

    return null;
  }

  componentDidUpdate(prevProps) {
    if (this.props.mode !== prevProps.mode) {
      // See https://github.com/airbnb/javascript/issues/1875 for why ignoring this line in linter.
      this.setState({ // eslint-disable-line react/no-did-update-set-state
        height: this.content.current.offsetHeight,
      });

      // Focus the first element of the new content.
      const focusableElements = this.content.current.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      if (focusableElements[0]) focusableElements[0].focus();
    }
  }

  onTransitionEnd() {
    // After finishing the height transition remove our pixel height value
    this.setState({ height: null });
  }

  onClickEdit() {
    this.props.onEdit(this.props.name);
  }

  onClickSave() {
    this.props.onSave(this.props.name, this.state.values);
  }

  onClickCancel() {
    this.setState({ values: this.props.values });
    this.props.onCancel();
  }

  setValueState(valueState) {
    // Use Object.assign to shallow merge the same as setState
    this.setState({
      values: Object.assign({}, this.state.values, valueState),
    });
  }
  render() {
    const {
      tag: Tag, // Breaks if React.Fragment is passed in because of transition
      className,
      renderStatic,
      renderEditable,
      renderEditing,
      mode,
    } = this.props;

    const transitionProps = {
      timeout: 250,
      classNames: 'crossfade',
      unmountOnExit: true,
      mountOnEnter: true,
      onExited: this.onTransitionEnd,
    };

    const isEditing = mode === 'editing';

    return (
      <Tag
        ref={this.container}
        className={classNames('editable-content-container', className)}
        style={{ height: this.state.height }}
      >
        <CSSTransition in={mode !== 'editing'} {...transitionProps}>
          <div ref={!isEditing ? this.content : null} className="editable-content">
            {mode === 'editable' ? renderEditable(this.onClickEdit) : renderStatic(this.props) }
          </div>
        </CSSTransition>

        <CSSTransition in={mode === 'editing'} {...transitionProps}>
          <div ref={isEditing ? this.content : null} className="editable-content">
            {renderEditing(this.state.values || this.props.values, this.setValueState)}
            <EditControls
              onCancel={this.onClickCancel}
              onSave={this.onClickSave}
              visibility={
                this.state.values ? this.state.values.visibility : this.props.values.visibility
              }
              onVisibilityChange={e => this.setValueState({
                visibility: e.target.value,
              })}
            />
          </div>
        </CSSTransition>
      </Tag>
    );
  }
}


EditableContent.propTypes = {
  tag: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  className: PropTypes.string,
  name: PropTypes.string.isRequired,
  mode: PropTypes.oneOf(['static', 'editable', 'editing']),
  values: PropTypes.object, // eslint-disable-line
  renderStatic: PropTypes.func,
  renderEditable: PropTypes.func,
  renderEditing: PropTypes.func,
  onEdit: PropTypes.func,
  onSave: PropTypes.func,
  onCancel: PropTypes.func,
};

EditableContent.defaultProps = {
  tag: 'div',
  className: null,
  mode: 'static',
  values: {},
  renderStatic: () => {},
  renderEditable: () => {},
  renderEditing: () => {},
  onEdit: () => {},
  onSave: () => {},
  onCancel: () => {},
};


export default EditableContent;
