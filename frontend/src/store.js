
import { createStore, applyMiddleware, compose } from 'redux';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './reducers/index';
import watcherSaga from './actions/sagas';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();

const composeEnhancers =
  typeof window === 'object' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({}) : compose;
const enhancer = composeEnhancers(
  applyMiddleware(sagaMiddleware),
  // other store enhancers if any
);
// create a redux store with our reducer above and middleware
let store = createStore(
  rootReducer,
  enhancer
);

// run the saga
sagaMiddleware.run(watcherSaga);


export default store;