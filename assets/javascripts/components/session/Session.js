import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { actions as sessionActions } from '../../redux/session/session';

export class Session extends React.Component {
  static propTypes = {
    status     : PropTypes.string.isRequired,
    user       : PropTypes.object,
    sendLogout : PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object
  }

  componentDidUpdate() {
    if( this.props.status === 'initial' ) {
      this._handleLogout();
    }
  }

  _logout = () => {
    this.props.sendLogout();
  }

  _handleLogout() {
    this.context.router.replace( '/login' );
  }

  render() {
    return (
      <div className="session">
        { this.props.user &&
          <h5>{ this.props.user.first_name + ' ' + this.props.user.last_name }</h5>
        }
        <div className="button" onClick={ this._logout }>Sign Out</div>
      </div>
    );
  }
}

export default connect(
  state => ({
    status: state.session.session.status,
    user: state.session.session.user
  }),
  sessionActions
)(Session);