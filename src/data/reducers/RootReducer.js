import { combineReducers } from 'redux';
import { userAccount } from '@edx/frontend-auth';
import profile from './ProfileReducer';

const identityReducer = (state) => {
  const newState = { ...state };
  return newState;
};

const rootReducer = combineReducers({
  // The authentication state is added as initialState when
  // creating the store in data/store.js.
  authentication: identityReducer,
  userAccount,
  profile,
});

export default rootReducer;
