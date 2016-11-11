/**
 * This is the client-side main entry point
 * For Universal rendering, @see index-server.js
 */
import 'es6-shim';

import React from 'react';
import ReactDOM from 'react-dom';
import { match, useRouterHistory } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import config from './config';
import createRoutes from './routes';
import Root from './root/Root';
import ExecutionEnvironment from 'exenv';
import configureStore from './root/utils/configureStore';
import { testSession } from './redux/session/session';
import { polyfill as polyfillEs6Promise } from 'es6-promise';
polyfillEs6Promise();
import 'whatwg-fetch';
import _debug from 'debug';
const debug = _debug('re:index');

const __SERVER__ = !ExecutionEnvironment.canUseDOM;
window.GLOBAL = {};
window.GLOBAL['fetch'] = fetch;

if (config.__DEBUG__) {
  // enable debug module for all our modules
  // @see https://github.com/visionmedia/debug#browser-support
  if (window.localStorage) { localStorage.debug = 're:*' }
}

// Create Routing History
const historyConfig = { basename : config.__BASENAME__ };
const history = useRouterHistory( createBrowserHistory )( historyConfig );

// Create Redux Store
const initialState = window.__INITIAL_STATE__;
const store = configureStore({ initialState, history });

// Create routes, providing store for checking auth.
const routes = createRoutes(store);

// match()? Huh?
// see: https://goo.gl/K5R3nd (<noscript> react complaint)
// see: https://goo.gl/8PnDyB (async routes)
// You can use dynamic routing if you have a large app;
//  see: https://goo.gl/vPaBZh
match({history, routes}, (error, redirectLocation, renderProps) => {

  if (!error) {

    if (renderProps) {
      renderProps.history = history;
    }

    store.dispatch( testSession() ).then( () => {
      ReactDOM.render(
        <Root store={ store } renderProps={ renderProps } />,
        document.getElementById( 'root' )
      )
    });

    // Signals that client-side load is complete.
    debug('🔰 Client ready.');
    document.body.className = 'client-ready';

  } else {
    debug(' ❌ Routing error in Match()', error);
  }

})

// remove initial state if rendered server-side
const node = document.getElementById('__initial_state__');
if (node && node.parentNode) { node.parentNode.removeChild(node) }
