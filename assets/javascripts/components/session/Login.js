import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { actions as sessionActions } from '../../redux/session/session';
import ValidInput from '../common/ValidInput';

export class Login extends React.Component {
  static propTypes = {
    status    : PropTypes.string.isRequired,
    sendLogin : PropTypes.func.isRequired
  };

  static contextTypes = {
    router: PropTypes.object,
    throwModal: PropTypes.func
  }

  componentDidUpdate() {
    if( this.props.status === 'success' ) {
      this._handleLogin();
    }
  }

  _submit = (e) => {
    e.preventDefault();
    this.props.sendLogin( this.refs.email.value, this.refs.password.value );
  }

  _handleLogin() {
    let pathname = ( this.props.location.state ) ? this.props.location.state.nextPathname : '/';
    this.context.router.replace( pathname );
  }

  render() {
    // Dummy "errors" for ValidInput example. Could be validation errors from API...
    let errors = {};
    if (this.props.status === 'error') {
      errors = {
        email: ['This might be the problem.'],
        password: ['Or it could be this...']
      }
    }

    return (
      <div className="login-view">
        <h1>{ this._renderLoginStatus() }</h1>

        <form>

          <ValidInput class_names="foo" errors={ errors.email }>
            <label htmlFor="email">Email:</label>
            <input type="text" id="email" ref="email"/>
          </ValidInput>

          <ValidInput class_names="foo" errors={ errors.password }>
            <label htmlFor="password">Password:</label>
            <input type="password" id="password" ref="password"/>
          </ValidInput>

          <button type="submit" onClick={ this._submit }>Submit</button>
          <br/>
          <Link to="/forgot-password">Forgot Passsword</Link>
        </form>
      </div>
    );
  }

  _renderLoginStatus() {
    switch( this.props.status ) {
      case 'sending':
        return <span>Signing In...</span>;
      case 'error':
        return <p className="error-message">There was an error. Please review your information and try again.</p>;
      default :
        return <span>Sign In:</span>
    }
  }
}

export default connect(
  state => ({ status: state.session.session.status }),
  sessionActions
)(Login);