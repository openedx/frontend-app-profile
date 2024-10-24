import { combineReducers } from 'redux';

import { reducer as profilePage } from '../profile-v2';

const createRootReducer = () => combineReducers({
  profilePage,
});

export default createRootReducer;
