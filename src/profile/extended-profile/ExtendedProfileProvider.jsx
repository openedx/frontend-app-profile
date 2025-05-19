import { useEffect, useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import ExtendedProfileFieldsContext from './ExtendedProfileContext';
import { getExtendedProfileFields } from './data/service';
import { patchProfile } from '../data/services';

import { FORM_MODE } from './constants';

const ExtendedProfileFieldsProvider = ({ children }) => {
  const [extendedProfileFields, setExtendedProfileFields] = useState();
  const [editMode, setEditMode] = useState(FORM_MODE.EDITABLE);
  const [editingInput, setEditingInput] = useState(null);
  const [saveState, setSaveState] = useState('default');

  useEffect(() => {
    (async () => {
      const res = await getExtendedProfileFields();
      setExtendedProfileFields(res.fields);
    })();
  }, []);

  const handleChangeFormMode = (mode, fieldName = null) => {
    setEditMode(mode);
    setEditingInput(fieldName);
  };

  const handleSaveExtendedProfile = async (username, params) => {
    await patchProfile(username, params);
  };

  const handleResetFormEdition = () => {
    setEditMode(FORM_MODE.EDITABLE);
    setEditingInput(null);
    setSaveState('default');
  };

  const handleChangeSaveState = (state) => {
    setSaveState(state);
  };

  const value = useMemo(() => ({
    editMode,
    extendedProfileFields,
    editingInput,
    saveState,
    handleChangeFormMode,
    handleResetFormEdition,
    handleSaveExtendedProfile,
    handleChangeSaveState,
  }), [editMode, editingInput, extendedProfileFields, saveState]);

  return (
    <ExtendedProfileFieldsContext.Provider value={value}>
      {children}
    </ExtendedProfileFieldsContext.Provider>
  );
};

ExtendedProfileFieldsProvider.propTypes = {
  children: PropTypes.node || PropTypes.arrayOf(PropTypes.node),
};

export default ExtendedProfileFieldsProvider;
