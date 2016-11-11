import React from 'react';
import { Route, IndexRoute, Redirect } from 'react-router';

// Layouts
import OuterLayout from './components/layouts/OuterLayout';
import InnerLayout from './components/layouts/InnerLayout';

// Application Section Components
import NotFound from './components/common/NotFound';

// Mock "Public" Components
import Home from './components/Home';
import Foo from './components/Foo';
import Bar from './components/Bar';

// Mock "Private" Component - Route Requires Login
import Baz from './components/Baz';
import Biz from './components/Biz';

// Session Components
import Login from './components/session/Login';
import ForgotPassword from './components/session/ForgotPassword';
import ResetPassword from './components/session/ResetPassword';

export default function createRoutes( store ) {

  // Requires Authorization:
  // If you're not lgogged in, you will be redirected to '/login'
  const requireAuth = function( nextState, replace ) {
    console.log('Router::Requiring Authorization', store.getState().session );
    if ( !store.getState().session.session.valid ) {
      replace({ pathname: '/login', state: { nextPathname: nextState.location.pathname } });
    }
  }

  // Foregoes Auhtorization:
  // If you're alrady lgogged in, you pass through to '/'
  const foregoAuth = function ( nextState, replace ) {
    if ( store.getState().session.session.valid ) {
      replace( '/' );
    }
  }

  return (
    <Route path='/' component={ OuterLayout }>
      { /* This is the public area of the application. */ }
      <IndexRoute component={ Home }/>
      <Route path="foo" component={ Foo }/>
      <Route path="bar" component={ Bar }/>

      {/* Naturally, the login-related routes must be "public": */}
      <Route path='login' component={ Login } />
      <Route path="forgot-password" component={ ForgotPassword }/>
      <Route path="reset-password" component={ ResetPassword }/>

      {/* Wraper for "private" routes. If entire app is private, also make an IndexRoute */}
      <Route path="/" component={ InnerLayout } onEnter={ requireAuth }>
        <Route path="baz" component={ Baz }/>
        <Route path="biz" component={ Biz }/>
      </Route>

      {/* 404's - Unmatched routes will pass through to *, which will redirect to 404 */}
      <Route path='/404' component={ NotFound } />
      <Redirect from='*' to='/404' />
    </Route>
  );
}