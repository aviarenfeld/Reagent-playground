const ReagentServerRender = require('./render-server');
const DefaultConfig = require('./render-server').DefaultConfig;
const fetchComponentData = require('./utils/fetchComponentData');
const renderError = require('./utils/renderError');

module.exports = ReagentServerRender;

module.exports.DefaultConfig = DefaultConfig;
module.exports.fetchComponentData = fetchComponentData;
module.exports.renderError = renderError;
