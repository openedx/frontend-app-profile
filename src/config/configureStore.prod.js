import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';

import apiClient from './apiClient';
import reducers from '../reducers/RootReducer';
import rootSaga from '../sagas/RootSaga';

export default function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const initialState = apiClient.getAuthenticationState();

  const store = createStore(
    reducers,
    initialState,
    applyMiddleware(thunkMiddleware, sagaMiddleware),
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
