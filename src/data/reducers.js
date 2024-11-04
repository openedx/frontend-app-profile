import { combineReducers } from 'redux';

import { reducer as profilePage } from '../profile';
import { reducer as NewProfilePageReducer } from '../profile-v2';

const isNewProfileEnabled = process.env.ENABLE_NEW_PROFILE_VIEW === 'true';

const createRootReducer = () => combineReducers({
  profilePage: isNewProfileEnabled ? NewProfilePageReducer : profilePage,
});

export default createRootReducer;
