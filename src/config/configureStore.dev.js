import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';

import apiClient from './apiClient';
import createRootReducer from '../reducers/RootReducer';
import rootSaga from '../sagas/RootSaga';

export default function configureStore() {
  const history = createBrowserHistory();

  const loggerMiddleware = createLogger();
  const sagaMiddleware = createSagaMiddleware();
  const initialState = apiClient.getAuthenticationState();

  const store = createStore(
    createRootReducer(history),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware, sagaMiddleware, routerMiddleware(history), loggerMiddleware)), // eslint-disable-line
  );

  sagaMiddleware.run(rootSaga);

  return { store, history };
}
