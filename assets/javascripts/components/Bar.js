import React, { PropTypes } from 'react';

import { testSession } from '../redux/session/session';

export default class Bar extends React.Component {

  static contextTypes = {
    showOverlay: PropTypes.func
  };

  /**
   * Example of using data prefetching.
   */
  static needs = [
    ( params, query, dispatch ) => {
      return dispatch( testSession() )
        .then( response => {
          console.log('static needs response in Bar.js:', response);
          return response;
        });
    }
  ];

  state = {
    status: 'Ready.'
  }

  _onClose = () => {
    this.setState({ status: 'Closed.' });
  }

  _onCancel = () => {
    this.setState({ status: 'Canceled.' });
  }

  _onConfirm = () => {
    this.setState({ status: 'Confirmed.' });
  }

  _simpleFlash = () => {
    this.context.showOverlay({
      flash   : true,
      content : <p>Your flash notice has been shown.</p>,
      dismiss : ::this._onClose
    });
  }

  _stickyFlash = () => {
    this.context.showOverlay({
      flash   : true,
      flash_warn : true,
      flash_timeout : null,
      content : <p>Another flash notice has been shown.</p>,
      dismiss : ::this._onClose
    });
  }

  _simpleModal = () => {
    this.context.showOverlay({
      content: <p>This message is important</p>,
      dismiss: this._onClose
    });
    this.setState({ status: 'Opened.' });
  }

  _confirmModal = () => {
    this.context.showOverlay({
      content: <p>This message is important</p>,
      dismiss: ::this._onCancel,
      confirm: ::this._onConfirm
    });
    this.setState({ status: 'Opened.' });
  }

  render() {
    return (
      <nav>
        <p><strong>Status: </strong>{ this.state.status }</p>
        <a className="button" onClick={ this._simpleFlash }>Show Flash</a>
        <a className="button" onClick={ this._stickyFlash }>Show Sticky Flash</a>
        <a className="button" onClick={ this._simpleModal }>Show Modal</a>
        <a className="button" onClick={ this._confirmModal }>Show Confirmable Modal</a>
      </nav>
    );
  }
}