import { applyMiddleware, createStore } from 'redux';
import createSagaMiddleware from 'redux-saga';
import thunkMiddleware from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { createLogger } from 'redux-logger';

import createRootReducer from '../reducers';
import rootSaga from '../sagas';

export default function configureStore(initialState = {}) {
  const loggerMiddleware = createLogger({
    collapsed: true,
  });
  const sagaMiddleware = createSagaMiddleware();

  const store = createStore(
    createRootReducer(),
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware, sagaMiddleware, loggerMiddleware)), // eslint-disable-line
  );

  sagaMiddleware.run(rootSaga);

  return store;
}
