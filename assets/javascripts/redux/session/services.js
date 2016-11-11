/*
  Services are API interface methods.
  See ./APIService for request logic.
*/

import APIService from '../utils/APIService';
import { API } from '../../config';
import { actions as sessionActions } from './session';

class SessionServices extends APIService {

  test() {
    return this.request(
      API.SESSION_URL, {
        method: 'get',
        credentials: 'same-origin'
      }
    );
  }

  submit( email, password ) {
    return this.request(
      API.SESSION_URL,
      {
        method: 'post',
        credentials: 'same-origin',
        body: { email, password }
      }
    );
  }

  logout() {
    return this.request(
      API.SESSION_URL,
      {
        method: 'DELETE',
        credentials: 'same-origin'
      }
    );
  }

  reset( email ) {
    return this.request(
      API.RESET_PASSWORD_URL,
      {
        method: 'post',
        credentials: 'same-origin',
        body: { email }
      }
    );
  }

  replace( email ) {
    return this.request(
      API.REPLACE_PASSWORD_URL,
      {
        method: 'post',
        credentials: 'same-origin',
        body: { email }
      }
    );
  }
}

export default new SessionServices();