import { combineReducers } from 'redux';

import { reducer as profilePage } from '../profile';

const createRootReducer = () => combineReducers({
  profilePage,
});

export default createRootReducer;
