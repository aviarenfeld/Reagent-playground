/**
 * this needs more documentation...
 *
 * Checks each React component for static `needs` property
 * and runs dispatch() on it.
 *
 */
module.exports = function fetchComponentData(dispatch, components, params, query) {
  const needs = components.reduce( (prev, current) => {
    return current ? (current.needs || []).concat(prev) : prev;
  }, []);

  const promises = needs.map(need => dispatch(need(params,query,dispatch)));

  return Promise.all(promises);
}
