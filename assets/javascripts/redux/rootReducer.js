import { combineReducers } from 'redux';
import { routerReducer as router } from 'react-router-redux';

import session from './session/session';

export default combineReducers({
  router,
  session
});