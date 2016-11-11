import React, { PropTypes } from 'react';
import classNames from 'classnames';
import Modal from './Modal';
import Flash from './Flash';

export default class Overlay extends React.Component {
  static propTypes = {
    content       : PropTypes.element.isRequired,
    dismiss       : PropTypes.func,
    confirm       : PropTypes.func,
    exit          : PropTypes.func,
    flash         : PropTypes.bool,
    flash_warn    : PropTypes.bool,
    flash_timeout : PropTypes.number
  };

  static defaultProps = {
    content       : null,
    dismiss       : null,
    confirm       : null,
    exit          : null,
    flash         : false,
    flash_warn    : false,
    flash_timeout : 3000
  }

  _exit = () => {
    if( this.props.dismiss ) {
      this.props.dismiss();
    }
    this.props.exit();
  }

  _confirm = () => {
    this.props.confirm();
    this.props.exit();
  }

  render() {
    if( this.props.flash ) {
      return <Flash
        content={ this.props.content }
        flash_warn={ this.props.flash_warn }
        flash_timeout={ this.props.flash_timeout }
        exit={ this._exit }
      />;
    } else {
      return <Modal
        content={ this.props.content }
        type={ this.props.confirm ? 'confirm' : 'alert' }
        confirm={ this._confirm }
        exit={ this._exit }
      />;
    }
  }
}