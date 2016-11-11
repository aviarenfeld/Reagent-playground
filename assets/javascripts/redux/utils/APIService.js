/*
  API Request Interface.
  Utilizes `fetch`: Using fetch polyfill: https://github.com/github/fetch
*/
import { polyfill as polyfillEs6Promise } from 'es6-promise';
polyfillEs6Promise();
import _debug from 'debug';
const debug = _debug('re:apiservice');

let defaults = {
  credentials: 'include', // use this for hacked cross-domain usage
  // credentials: 'same-origin',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
}

export default class APIService {

  testResponseStatus( response ) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      throw response;
    }
  }

  parseJSON( response ) {
    return response.json().catch( () => response );
  }

  request( url, options ){
    return fetch( url, Object.assign( {}, defaults, options, { body: JSON.stringify(options.body) } ) )
          .then( this.testResponseStatus )
          .then( this.parseJSON )
          .then( data => {
            debug( 'APIRequest::Success', data );
            return data;
          })
          .catch( error => {
            debug( 'APIRequest::Failure', error );
            if( error.json ) {
              return error.json().then( json => {
                throw json;
              });
            } else {
              throw error;
            }
          });
  }
}
