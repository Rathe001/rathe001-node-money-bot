import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { initialState } from 'constants/initialState';

import coreReducers from './reducers';
import coreSagas from './sagas';

const sagaMiddleware = createSagaMiddleware();

// eslint-disable-next-line
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
  coreReducers,
  initialState,
  composeEnhancers(applyMiddleware(sagaMiddleware)),
);

sagaMiddleware.run(coreSagas);

export default store;
