import { combineReducers } from 'redux';
import { userAccount } from '@edx/frontend-auth';

import { reducer as profilePage } from '../profile';

const createRootReducer = () =>
  combineReducers({
    userAccount,
    profilePage,
  });

export default createRootReducer;
