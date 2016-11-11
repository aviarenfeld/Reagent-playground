/**
 * Reagent ExpressJS Middleware for ISO Rendering
 */

require('./polyfills/fetch');
const debug = require('debug')('re:ssr 🔰 ');
const loader = require('jspm').Loader();
const sendToClient = require('./utils/renderError');
const chalk = require('chalk');
const chkLabel = chalk.magenta.bold;
const chkVal = chalk.yellow.bold;

/**
 * Default config object which is exported as `DefaultConfig`.
 * Load it and change if needed.
 */
const ServerRenderConfig = {
  // these may need adjustment depending on Express App's CWD (current working dir)
  // at startup. They work server is subdir of reagent, AND we're serving
  // from top-level `public` dir.
  entry: 'assets/javascripts/index-server',
  htmlTemplate: 'assets/javascripts/index.html.js'
}

/**
 * Express Middleware
 *
 * usage:
 *  const ssr = require('../public/assets/javascripts/express-middleware/render-server');
 *  ... middleware
 *  app.use(express.static(path.join(__dirname, '../public'), { index: false }));
 *  app.use('/', ssr());
 */
function ReagentServerRender(_config) {
  _config = _config || {};
  const config = Object.assign({}, ServerRenderConfig, _config)
  config.debug = debug;

  debug(`ReagentServerRender initialized. `
    + `\n\t${ chkLabel('SSR-Entry') }: "${ chkVal(config.entry) }"`
    + `\n\t${ chkLabel('HTML Template') }: "${ chkVal(config.htmlTemplate) }"`);

  return function(req, res, next) {
    // handle Reagent's session request. Can be deleted.
    if (req.path === '/api/v1/session') {
      return res.json( {session: {user: {last_name: 'ReAgent', first_name: 'Secret'}} } );
    }

    debug(`~> ${req.path}`);

    loader.import(config.entry).then(function (module){
      // any default export from module is available as `module.default`.
      // named exports are available as, e.g., export foo; --> `module.foo`.
      const serverRender = module.default;
      serverRender(req, res, debug);
    })
    .catch(function (error) {
      console.log('👿  SysJS Load Error:', error);
      console.log(error.stack);

      if (process.env.NODE_ENV && process.env.NODE_ENV !== 'development') {
        return res.status(500).end('Internal server error [SysJS-Throw]');
      } else {
        // load our index.html.js template
        return sendToClient(req, res, error, config.htmlTemplate);
      }

    });

  }
}

/**
 * Module exports.
 * @public
 */
module.exports = ReagentServerRender;
module.exports.DefaultConfig = ServerRenderConfig;
