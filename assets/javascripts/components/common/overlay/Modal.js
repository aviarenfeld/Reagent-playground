import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default class Modal extends React.Component {
  static propTypes = {
    content : PropTypes.element.isRequired,
    confirm : PropTypes.func,
    exit    : PropTypes.func
  };

  static defaultProps = {
    content : <div></div>,
    confirm : null,
    exit    : null
  }

  get is_confirm() {
    return this.props.type === 'confirm';
  }

  render() {
    let exit_classes = classNames( 'button', {
      'cancel' : this.is_confirm
    });

    return(
      <div className="modal">
        <div className="modal-curtain"></div>
        <div className="modal-window">
          <div className="modal-content">
            { this.props.content }
          </div>
          <div className="modal-actions">
            <div className={ exit_classes } onClick={ this.props.exit }>{ this.is_confirm ? 'Cancel' : 'OK' }</div>
            { this.is_confirm &&
              <div className="button confirm" onClick={ this.props.confirm }>OK</div>
            }
          </div>
        </div>
      </div>
    );
  }
}