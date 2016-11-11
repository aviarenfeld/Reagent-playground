/**
 * This is loaded with JSPM so we're using ES6 syntax rather than Node conventions.
 *
 */
import React from 'react';
import { applyMiddleware, compose, createStore } from 'redux';
import { Provider } from 'react-redux';
import { renderToString } from 'react-dom/server';
import { match, useRouterHistory } from 'react-router';
import createLocation from 'history/lib/createLocation';
import thunk from 'redux-thunk';
import promiseMiddleware from './redux/middleware/promiseMiddleware';
import rootReducer from './redux/rootReducer';
import { createMemoryHistory } from 'history';
import config from './config';
import createRoutes from './routes';
import template from './index.html.js';
import Root from './root/Root';
import Helmet from 'react-helmet';
import fetchComponentData from './express-middleware/utils/fetchComponentData';
import renderError from './express-middleware/utils/clientRenderErrorHandler';
import isBot from './express-middleware/utils/bot-sniffer';

// export func which receives Express's request and response objects
// this function will fully handle the request, be it a runtime error,
// redirect, or rendered web page.
export default function (req, res, debug) {
  debug = debug || console.log;
  const historyConfig = { basename : config.__BASENAME__ };
  const history = useRouterHistory( createMemoryHistory )( historyConfig );
  const initialState = {};

  let finalCreateStore = applyMiddleware(promiseMiddleware, thunk/*, routerMiddleware*/);
  const store = finalCreateStore(createStore)(rootReducer, initialState);
  const routes = createRoutes(store);

  // not sure whether it matters, but if there was a query attached to the request
  // it's not getting injected into this location object. Unable to find useful
  // information about this. req.query contains that portion of the url.
  // https://github.com/mjackson/history/blob/master/docs/Location.md#programmatic-creation
  const location = createLocation(req.originalUrl);

  // for server rendering (SSR), use react-router `match()` insetad of <Router...>
  match({ routes, location }, (err, redirectLocation, renderProps) => {

    if(err) {
      console.error(err);
      return res.status(500).end('Internal server error:', err);
    }

    if(redirectLocation) {
      debug('Redirect: %s', redirectLocation.pathname);
      return res.redirect(301, redirectLocation.pathname);
    }

    if(!renderProps)
      return res.status(404).end('Not found');

    // renders app in our template
    function renderView() {
      const InitialView = (
        <Root store={ store } renderProps={ renderProps } />
      );

      const renderedComponent = renderToString(InitialView);
      const head = Helmet.rewind();
      let initialState = store.getState();
      const options = {
        head,
        env: process.env.NODE_ENV || 'development',
        isBot: isBot(req.get('user-agent'))
      };
      const HTML = template(renderedComponent, initialState, options);
      debug(`ServerRender - ${req.method}: ${req.url}`);
      return HTML;
    }

    // get component data defined by any `static needs = [...]` properties.
    fetchComponentData(store.dispatch, renderProps.components, renderProps.params, renderProps.location.query )
      .then(renderView)
      .then(html => res.end(html))
      .catch(err => renderError(req, res, err, template) );
  });
}
