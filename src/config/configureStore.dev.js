import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';

import apiClient from './apiClient';
import reducers from '../reducers/RootReducer';
import rootSaga from '../sagas/RootSaga';

export default function configureStore() {
  const loggerMiddleware = createLogger();
  const sagaMiddleware = createSagaMiddleware();
  const initialState = apiClient.getAuthenticationState();

  const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware, sagaMiddleware, loggerMiddleware)),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
