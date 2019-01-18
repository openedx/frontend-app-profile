import PropTypes from 'prop-types';


function EditableContent(props) {
  const {
    isEditing,
    disabled,
    renderStatic,
    renderEditable,
    renderEditing,
  } = props;

  if (disabled) {
    return renderStatic(props);
  }
  if (isEditing) {
    return renderEditing(props);
  }

  return renderEditable(props);
}

EditableContent.propTypes = {
  isEditing: PropTypes.bool,
  disabled: PropTypes.bool,
  renderStatic: PropTypes.func,
  renderEditable: PropTypes.func,
  renderEditing: PropTypes.func,
};

EditableContent.defaultProps = {
  isEditing: false,
  disabled: false,
  renderStatic: () => {},
  renderEditable: () => {},
  renderEditing: () => {},
};


export default EditableContent;
