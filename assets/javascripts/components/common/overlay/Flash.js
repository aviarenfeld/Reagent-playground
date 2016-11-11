import React, { PropTypes } from 'react';
import classNames from 'classnames';

export default class Flash extends React.Component {
  static propTypes = {
    content       : PropTypes.element.isRequired,
    exit          : PropTypes.func,
    flash_warn    : PropTypes.bool,
    flash_timeout : PropTypes.number
  };

  static defaultProps = {
    content       : null,
    exit          : null,
    flash_warn    : false,
    flash_timeout : 3000
  }

  componentDidMount() {
    this.initExitTO();
  }

  componentDidUpdate( prevProps ) {
    if( prevProps.content !== this.props.content ) {
      clearTimeout( this.exitTO );
      this.initExitTO();
    }
  }

  initExitTO() {
    if( this.props.flash_timeout ) {
      this.exitTO = setTimeout(
        this.props.exit,
        this.props.flash_timeout
      );
    }
  }

  render() {
    let flash_classes = classNames( 'flash', {
      'warn' : this.props.flash_warn
    });

    return(
      <div className={ flash_classes }>
        <div className="flash-content">
          { this.props.content }
        </div>
        <div className="flash-actions">
          <div className="button" onClick={ this.props.exit }>
            <span className="icon icon-cross"></span>
          </div>
        </div>
      </div>
    );
  }
}