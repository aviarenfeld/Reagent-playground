// main app template for server-side rendering
export default function (componentHtml, initialState, options) {
  const { head, env, isBot } = options;

  const productionScript = `
    <script>
      window.__application_env = 'production';
    </script>
    <script src="/assets/javascripts/main.bundle.js"></script>
  `;

  const developmentScript = `
    <script src="/jspm_packages/system.js"></script>
    <script src="/config.js"></script>
    <script>
      console.log('__INITIAL_STATE__', __INITIAL_STATE__);
      window.__application_env = 'development';
      System.import('/assets/javascripts/index-client');
    </script>
  `;

  const productionHeadExtras = `
    <link rel="prefetch" href="/assets/javascripts/main.bundle.js" />
  `
  const developmentHeadExtras = `
    <link rel="prefetch" href="/jspm_packages/system.js" />
    <link rel="prefetch" href="/config.js" />
  `
  const loader = env === 'development' ? developmentScript : productionScript;
  const headExtras = env === 'development' ? developmentHeadExtras : productionHeadExtras;

  // -------- main HTML template ---------
  const HTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta http-equiv="X-UA-Compatible" content="IE=edge">
      ${headExtras}
      ${head.meta.toString()}
      ${head.title.toString()}
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <link rel="stylesheet" href="/assets/stylesheets/main.css">
      <link rel="shortcut icon" href="/assets/images/favicon.png?v=1"/>
    </head>
    <body>
      <script id="__initial_state__">
        window.__INITIAL_STATE__ = ${JSON.stringify(initialState)};
      </script>
      <div id="root">${componentHtml}</div>
      <script>window.isBot = ${isBot};</script>
      ${loader}
      <script type="text/javascript">
          // var _mfq = _mfq || [];
          // (function() {
          //     var mf = document.createElement("script");
          //     mf.type = "text/javascript"; mf.async = true;
          //     mf.src = "//cdn.mouseflow.com/projects/ee757da3-2fd0-4ceb-8ee5-296ae2ecf58a.js";
          //     document.getElementsByTagName("head")[0].appendChild(mf);
          // })();
      </script>
    </body>
    </html>
  `
  return HTML;
}
