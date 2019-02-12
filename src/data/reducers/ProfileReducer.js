import { SAVE_USER_PROFILE } from '../../actions/profileActions';

const initialState = {
  error: null,
  saveState: null,
};

const profile = (state = initialState, action) => {
  switch (action.type) {
    case SAVE_USER_PROFILE.BEGIN:
      return {
        ...state,
        saveState: 'pending',
        error: null,
      };
    case SAVE_USER_PROFILE.SUCCESS:
      return {
        ...state,
        saveState: 'complete',
        error: null,
      };
    case SAVE_USER_PROFILE.FAILURE:
      return {
        ...state,
        saveState: 'error',
        error: action.payload.error,
      };
    case SAVE_USER_PROFILE.RESET:
      return {
        ...state,
        saveState: null,
        error: null,
      };
    default:
      return state;
  }
};

export default profile;
