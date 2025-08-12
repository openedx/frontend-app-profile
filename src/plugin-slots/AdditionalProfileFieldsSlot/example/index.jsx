import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from '@openedx/paragon';
import { getAuthenticatedUser } from '@edx/frontend-platform/auth';

/**
 * Straightforward example of how you could use the pluginProps provided by
 * the AdditionalProfileFieldsSlot to create a custom profile field.
 *
 * Here you can set a 'favorite_color' field with radio buttons and
 * save it to the user's profile, especifically to their `meta` in
 * the user's model. For more information, see the documentation:
 *
 * https://github.com/openedx/edx-platform/blob/master/openedx/core/djangoapps/user_api/README.rst#persisting-optional-user-metadata
 */
const Example = ({
  updateUserProfile,
  profileFieldValues,
  profileFieldErrors,
  formComponents: { SwitchContent, EditableItemHeader, EmptyContent } = {},
}) => {
  const authenticatedUser = getAuthenticatedUser();
  const [formMode, setFormMode] = useState('editable');

  // Get current favorite color from profileFieldValues
  const currentColorField = profileFieldValues?.find(field => field.fieldName === 'favorite_color');
  const currentColor = currentColorField ? currentColorField.fieldValue : '';

  const [value, setValue] = useState(currentColor);
  const handleChange = e => setValue(e.target.value);

  // Get any validation errors for the favorite_color field
  const colorFieldError = profileFieldErrors?.favorite_color;

  useEffect(() => {
    if (!value) { setFormMode('empty'); }
    if (colorFieldError) {
      setFormMode('editing');
    }
  }, [colorFieldError, value]);

  const handleSubmit = () => {
    try {
      updateUserProfile(authenticatedUser.username, { extendedProfile: [{ fieldName: 'favorite_color', fieldValue: value }] });
      setFormMode('editable');
    } catch (error) {
      setFormMode('editing');
    }
  };

  return (
    <div className="border .border-accent-500 p-3">
      <h3 className="h3">Example Additional Profile Fields Slot</h3>

      <SwitchContent
        className="pt-40px"
        expression={formMode}
        cases={{
          editing: (
            <>
              <label className="edit-section-header" htmlFor="favorite_color">
                Favorite Color
              </label>
              <input
                className="form-control"
                id="favorite_color"
                name="favorite_color"
                value={value}
                onChange={handleChange}
              />
              <Button type="button" className="mt-2" onClick={handleSubmit}>
                Save
              </Button>
            </>
          ),
          editable: (
            <>
              <div className="row m-0 pb-1.5 align-items-center">
                <p data-hj-suppress className="h5 font-weight-bold m-0">
                  Favorite Color
                </p>
              </div>
              <EditableItemHeader
                content={value}
                showEditButton
                onClickEdit={() => setFormMode('editing')}
                showVisibility={false}
                visibility="private"
              />
            </>
          ),
          empty: (
            <>
              <div className="row m-0 pb-1.5 align-items-center">
                <p data-hj-suppress className="h5 font-weight-bold m-0">
                  Favorite Color
                </p>
              </div>
              <EmptyContent onClick={() => setFormMode('editing')}>
                <p className="mb-0">Click to add your favorite color</p>
              </EmptyContent>
            </>
          ),
        }}
      />

    </div>
  );
};

Example.propTypes = {
  updateUserProfile: PropTypes.func.isRequired,
  profileFieldValues: PropTypes.arrayOf(
    PropTypes.shape({
      fieldName: PropTypes.string.isRequired,
      fieldValue: PropTypes.oneOfType([
        PropTypes.string,
        PropTypes.bool,
        PropTypes.number,
      ]).isRequired,
    }),
  ),
  profileFieldErrors: PropTypes.objectOf(PropTypes.string),
  formComponents: PropTypes.shape({
    SwitchContent: PropTypes.elementType.isRequired,
  }),
};

export default Example;
