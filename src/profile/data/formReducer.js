/**
 * Client-side state of the profile form: which field is being edited, the unsaved drafts, the
 * per-field errors and the outcome of the last save. Server data lives in react-query; this is
 * everything else that more than one component needs to agree on.
 */

export const OPEN_FORM = 'OPEN_FORM';
export const CLOSE_FORM = 'CLOSE_FORM';
export const UPDATE_DRAFT = 'UPDATE_DRAFT';
export const SAVE_BEGIN = 'SAVE_BEGIN';
export const SAVE_SUCCESS = 'SAVE_SUCCESS';
export const SAVE_FAILURE = 'SAVE_FAILURE';
export const SAVE_RESET = 'SAVE_RESET';

export const initialFormState = {
  currentlyEditingField: null,
  drafts: {},
  errors: {},
  saveState: null,
};

export const formReducer = (state = initialFormState, action = {}) => {
  switch (action.type) {
    case OPEN_FORM:
      return {
        ...state,
        currentlyEditingField: action.formId,
        drafts: {},
        saveState: null,
        errors: {},
      };

    case CLOSE_FORM:
      // Only the open form may close itself; a stale close from another field is ignored.
      if (action.formId !== state.currentlyEditingField) {
        return state;
      }
      return {
        ...state,
        currentlyEditingField: null,
        drafts: {},
        saveState: null,
        errors: {},
      };

    case UPDATE_DRAFT:
      return {
        ...state,
        drafts: { ...state.drafts, [action.name]: action.value },
      };

    case SAVE_BEGIN:
      return {
        ...state,
        saveState: 'pending',
        errors: {},
      };

    case SAVE_SUCCESS:
      return {
        ...state,
        saveState: 'complete',
        errors: {},
      };

    case SAVE_FAILURE:
      return {
        ...state,
        saveState: 'error',
        errors: action.errors,
      };

    case SAVE_RESET:
      return {
        ...state,
        saveState: null,
        errors: {},
      };

    default:
      return state;
  }
};
