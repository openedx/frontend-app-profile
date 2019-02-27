import { applyMiddleware, createStore, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import { createBrowserHistory } from 'history';
import { routerMiddleware } from 'connected-react-router';

import apiClient from './apiClient';
import createRootReducer from '../reducers/RootReducer';
import rootSaga from '../sagas/RootSaga';

export default function configureStore() {
  const history = createBrowserHistory();

  const sagaMiddleware = createSagaMiddleware();
  const initialState = apiClient.getAuthenticationState();

  const store = createStore(
    createRootReducer(history),
    initialState,
    compose(applyMiddleware(thunkMiddleware, sagaMiddleware, routerMiddleware(history))),
  );

  sagaMiddleware.run(rootSaga);

  return { store, history };
}
