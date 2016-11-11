// Outer Wrapper for Application
// Provides context-based access to Modal rendering.

import React, { PropTypes } from 'react'
import { IndexLink, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import Overlay from '../common/overlay/Overlay';

export default class OuterLayout extends React.Component {
  static propTypes = {
    children: PropTypes.element
  };

  static childContextTypes = {
    showOverlay : PropTypes.func
  };

  state = {
    overlay: null
  }

  getChildContext() {
    return {
      showOverlay: this.showOverlay
    }
  }

  showOverlay = ( overlay ) => {
    this.setState({ overlay: Object.assign( {}, overlay, { exit: this._closeOverlay } ) });
  }

  _closeOverlay = () => {
    this.setState({ overlay: null });
  }

  render() {
    return (
      <ReactCSSTransitionGroup transitionName="intro" transitionAppear={true} transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className="outer-layout">
          <h4><img src="/assets/images/favicon.png"/> <span>Reagent</span></h4>

          <div className="nav-container">
            <h5>Public Navigation</h5>

            <nav id="public-navigation">
              <IndexLink to="/" activeClassName="active">Home</IndexLink>
              <Link to="foo" activeClassName="active">Foo</Link>
              <Link to="bar" activeClassName="active">Bar ( Try Out Modals! )</Link>
              <Link to="baz" activeClassName="active">Baz ( Requires Login )</Link>
              <Link to="qux" activeClassName="active">Qux ( This Link Will 404 )</Link>
            </nav>
          </div>

          <div className='view-container'>
            <h5>Public Application Content</h5>
            { this.props.children }
          </div>
        </div>
        { this.state.overlay && <Overlay { ...this.state.overlay }/> }
      </ReactCSSTransitionGroup>
    )
  }
}