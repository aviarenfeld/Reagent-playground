import { applyMiddleware, compose, createStore } from 'redux';
import { syncHistoryWithStore, routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';
import DevTools from '../DevTools';

import config from '../../config';
import rootReducer from '../../redux/rootReducer';

function withDevTools (middleware) {
  const devTools = window.devToolsExtension
    ? window.devToolsExtension()
    : DevTools.instrument()
  return compose(middleware, devTools)
}

export default function configureStore ({ initialState = {}, history }) {
  // Sync with router via history instance (main.js)
  const ourRouterMiddleware = routerMiddleware(history);

  // Compose final middleware and use devtools in debug environment
  let middleware = applyMiddleware(thunk, ourRouterMiddleware);
  if (config.__DEBUG__) middleware = withDevTools(middleware);

  // Create final store and subscribe router in debug env ie. for devtools
  const store = middleware(createStore)(rootReducer, initialState);
  // if (config.__DEBUG__) routerMiddleware.listenForReplays(store, ({ router }) => router.location);

  return store;
}
