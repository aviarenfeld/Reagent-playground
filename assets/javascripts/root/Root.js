// Provides root application component.
// Binds together the history, routes and store.
// Creates Redux DevTools if needed.

import React, { PropTypes } from 'react';
import { Provider } from 'react-redux';
import { Router, RouterContext } from 'react-router';
import Helmet from 'react-helmet';
import ExecutionEnvironment from 'exenv';
import config from '../config';
import DevTools from './DevTools';
import createDevToolsWindow from './utils/createDevToolsWindow';
import ReactGA from 'react-ga';

const __SERVER__ = !ExecutionEnvironment.canUseDOM;

if( !__SERVER__ ) {
  ReactGA.initialize( config.GA_TRACKING_ID, { debug: config.__DEBUG_GA__ } );
}

export default class Root extends React.Component {
  static propTypes = {
    store   : PropTypes.object.isRequired,
    renderProps: PropTypes.object.isRequired
  };

  onRouterUpdate = () => {
    if ( !__SERVER__ ) {
      ReactGA.set({ page: window.location.pathname });
      ReactGA.pageview( window.location.pathname );
    }
  }

  get content () {
    return (
      <Router { ...this.props.renderProps } onUpdate={ this.onRouterUpdate }>
        { this.props.routes }
      </Router>
    );
  }

  get devTools () {
    if (config.__DEBUG__) {
      if (config.__DEBUG_NEW_WINDOW__) {
        if (!window.devToolsExtension) {
          createDevToolsWindow(this.props.store);
        } else {
          window.devToolsExtension.open();
        }
      } else if (!window.devToolsExtension) {
        return <DevTools />
      }
    }
  }

  render () {
    if (__SERVER__) {

      return (
        <Provider store={ this.props.store }>
          <div style={{ height: '100%' }}>
            <Helmet { ...config.HELMET } />
            <RouterContext {...this.props.renderProps} />
          </div>
        </Provider>
      )

    } else {

      return (
        <Provider store={ this.props.store }>
          <div style={{ height: '100%' }}>
            <Helmet { ...config.HELMET } />
            { this.content }
            { this.devTools }
          </div>
        </Provider>
      )

    }
  }
}
