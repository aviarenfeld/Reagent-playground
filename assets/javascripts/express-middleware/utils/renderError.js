// util to render on client when middleware/server-render has errors

// template = require('../../../assets/javascripts/index.html.js');

function safe_tags(str) {
  return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;') ;
}

module.exports = function (req, res, error, template) {
  const head = {
    meta: '',
    title: '<title>Server-Render Error</title>'
  };
  const style = 'color:white;background-color:#BF1E1E;font-size:15px;overflow: scroll;padding:5px;';
  const message = `<strong>Render Error:</strong><br>/
    <blockquote style="${ style }"><code><pre>
      ${ safe_tags(error.toString()) }
    </pre></code></blockquote>
  `;
  const productionMessage = `
    <strong>Uh oh, something went wrong.</strong>
    <!--
      ${ safe_tags(error.toString()) }
    -->
  `;
  const options = { head, env: process.env.NODE_ENV || 'development'};
  // use different response on production
  const displayMessage = process.env.NODE_ENV === 'production' ? productionMessage : message;
  const HTML = template(displayMessage, {}, options);

  res.send(HTML);

}
