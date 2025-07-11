import { combineReducers } from 'redux';

import { reducer as profilePageReducer } from '../profile';

const createRootReducer = () => combineReducers({
  profilePage: profilePageReducer,
});

export default createRootReducer;
