import { combineReducers } from 'redux';

import { getConfig } from '@edx/frontend-platform';

import { reducer as profilePageReducer } from '../profile';
import { reducer as newProfilePageReducer } from '../profile-v2';

const isNewProfileEnabled = getConfig().ENABLE_NEW_PROFILE_VIEW;

const createRootReducer = () => combineReducers({
  profilePage: isNewProfileEnabled ? newProfilePageReducer : profilePageReducer,
});

export default createRootReducer;
