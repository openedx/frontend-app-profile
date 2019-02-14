import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';
import { UserAccountApiService } from '@edx/frontend-auth';

import apiClient from './apiClient';
import reducers from './reducers/RootReducer';
import rootSaga from '../sagas/RootSaga';

const loggerMiddleware = createLogger();
const sagaMiddleware = createSagaMiddleware();
const initialState = apiClient.getAuthenticationState();
const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(thunkMiddleware, sagaMiddleware, loggerMiddleware)),
);

const apiService = new UserAccountApiService(apiClient, process.env.LMS_BASE_URL);
apiService.saveUserAccount = apiService.saveUserAccount.bind(apiService);

sagaMiddleware.run(rootSaga, apiService);

export default store;
