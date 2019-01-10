import { combineReducers } from 'redux';
import { userProfile } from '@edx/frontend-auth';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

const rootReducer = combineReducers({
  // The authentication state is added as initialState when
  // creating the store in data/store.js.
  authentication: identityReducer,
  userProfile,
});

export default rootReducer;
