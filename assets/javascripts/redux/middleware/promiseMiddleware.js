import { isFSA } from 'flux-standard-action';

function isPromise(val) {
  return val && typeof val.then === 'function';
}

// use `dispatch` rather than `next` to ensure we start at
// beginning of middleware chain
export default function promiseMiddleware({ dispatch }) {
  return next => action => {

    if (!isFSA(action)) {
      return isPromise(action)
        ? action.then(dispatch)
        : next(action);
    }

    return isPromise(action.payload)
      ? action.payload.then(
          result => dispatch({ ...action, payload: result }),
          error => dispatch({ ...action, payload: error, error: true })
        )
      : next(action);
  };
}
