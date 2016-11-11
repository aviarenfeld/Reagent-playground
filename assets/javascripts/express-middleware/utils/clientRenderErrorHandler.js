// error handler for index-server.js's .catch
import sendToClient from './renderError';

const renderError = (req, res, err, template) => {
  try {
    console.log('👿  Server Render Error:\n', err.stack);
    sendToClient(req, res, err.stack, template);
  } catch (_e) {
    console.log('Unhandled exception in index-server::handleError', _e.stack);
    sendToClient(req, res, _e, template);
  }
}
export default renderError
