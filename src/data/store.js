import { applyMiddleware, createStore } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';

import apiClient from './apiClient';
import reducers from './reducers';

const loggerMiddleware = createLogger();
const initialState = apiClient.getAuthenticationState();
const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware, loggerMiddleware)),
);

export default store;
