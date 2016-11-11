/*

  Session: State Design

  {
    session : {
      valid  : boolean,         // presence of a validated session
      status : string,          // stage of login process
      user   : object,          // logged in user, assuming API returns it on logn
      error  : boolean          // login failure, such as invalit credentials
      error_response : ?        // error response from the server
    },
    reset : {
      status : string,         // stage of the reset process
      error  : boolean,        // reset request failure, such as email not found or token refused
    }
  }

*/

import SessionServices from './services';

// ------------------------------------
// CONSTANTS:

// Action Type Identifiers
// ------------------------------------
export const TEST_SESSION_ERROR = 'TEST_SESSION_ERROR';
export const SUBMIT_LOGIN = 'SUBMIT_LOGIN';
export const SUBMIT_LOGIN_SUCCESS = 'SUBMIT_LOGIN_SUCCESS';
export const SUBMIT_LOGIN_ERROR = 'SUBMIT_LOGIN_ERROR';
export const SUBMIT_LOGOUT = 'SUBMIT_LOGOUT';
export const SUBMIT_LOGOUT_SUCCESS = 'SUBMIT_LOGOUT_SUCCESS';

// ------------------------------------
// ACTION CREATORS:

// Funcitonst that return FSA formatted
// action objects, to be dispatched.
// ------------------------------------
export const testSessionError = ( error ) => ({
  type: TEST_SESSION_ERROR,
  payload: error
});

// ASYNC ACTION CREATORS:
// Returns a new function that can
// dispatch actions.
// ------------------------------------
export const testSession = () => {
  return ( dispatch, getState ) => {
    return SessionServices.test().then(
      response => dispatch( submitLoginSuccess( response ) ),
      error => dispatch( testSessionError( error ) )
    );
  }
}


export const submitLogin = () => ({ type: SUBMIT_LOGIN });
export const submitLoginSuccess = ( response ) => ({
  type: SUBMIT_LOGIN_SUCCESS,
  payload: response
});
export const submitLoginError = ( error ) => ({
  type: SUBMIT_LOGIN_ERROR,
  payload: error
});

export const sendLogin = ( email, password ) => {
  return ( dispatch, getState ) => {
    dispatch(submitLogin());
    return SessionServices.submit( email, password ).then(
      response => dispatch( submitLoginSuccess( response ) ),
      error => dispatch( submitLoginError( error ) )
    );
  }
}

export const submitLogoutSuccess = () => ({ type: SUBMIT_LOGOUT_SUCCESS });
export const sendLogout = ( email, password ) => {
  return ( dispatch, getState ) => {
    return SessionServices.logout().then(
      response => dispatch( submitLogoutSuccess() )
    );
  }
}

// ------------------------------------
// Export `actions` object containing
// usable actions. Makes it easier to
// componse mapDispatchToProps.
// ------------------------------------
export const actions = {
  testSession,
  sendLogin,
  sendLogout
};

// ------------------------------------
// Reducer:

// Handle actions by type. Remember to
// keep functions pure, return new state
// objects rather than changing the state.
// ------------------------------------
const initial_state = {
  session: {
    status : 'initial',
    valid  : false,
    user   : {}
  },
  reset: {}
};

const ACTION_HANDLERS = {
  [ TEST_SESSION_ERROR ]: ( state, { payload, error } ) => {
    return Object.assign({}, state, {
      session: Object.assign({}, state.session, {
        status : 'failed',
        valid: false,
        error_response: payload,
        error: error
      })
    });
  },
  [ SUBMIT_LOGIN ]: ( state, { payload } ) => {
    return Object.assign({}, state, {
      session: Object.assign({}, state.session, {
        status: 'sending'
      })
    });
  },
  [ SUBMIT_LOGIN_SUCCESS ]: ( state, { payload } ) => {
    return Object.assign({}, state, {
      session: Object.assign({}, state.session, {
        status: 'success',
        valid: true,
        user: payload.session.user,
        error_response: null,
        error: null
      })
    });
  },
  [ SUBMIT_LOGIN_ERROR ]: ( state, { payload, error } ) => {
    return Object.assign({}, state, {
      session: Object.assign({}, state.session, {
        valid: false,
        error_response: payload.response || payload,
        error: error,
        status : 'error'
      })
    });
  },
  [ SUBMIT_LOGOUT_SUCCESS ]: ( state, { payload } ) => {
    return Object.assign({}, state, {
      session: {
        valid: false,
        status: 'initial',
        user: null
      }
    });
  }
};

export default function sessionReducer( state = initial_state, action ) {
  const handler = ACTION_HANDLERS[ action.type ];
  return handler ?  handler( state, action ) : state;
}
