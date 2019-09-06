import { combineReducers } from 'redux';
import { userAccount } from '@edx/frontend-auth';

import { profileReducer } from './profile';

const createRootReducer = () =>
  combineReducers({
    userAccount,
    profilePage: profileReducer,
  });

export default createRootReducer;
