## Reagent

React application chemistry set.

It's important to know this build assumes you have an API if you want to try to log in. So far, I've used the rev API as a surrogate API for testing. As such, log in and log are working fine.

> **NOTE:** See new [Universal Setup](#universal) details below.

#### Development Setup:

Ensure global dependencies:

1. Node https://nodejs.org/
2. Global NPM packages: `npm install -g jspm gulp`
3. Local NPM packages: `npm install`
4. JSPM packages: `jspm install` ( will be automatically run after `npm install` )

---
#### Gulp Tasks:

`gulp`:
> 1. Runs build tasks, (see below)
> 2. Watches `/gulp/assets`
> 3. Runs BrowserSync at `localhost:3000`

`gulp build`:
> 1. Cleans output folder `/public/assets`
> 2. Compresses images, compiles icon-font from svg, compiles scss, lints javascript, and composes html.
> 3. If *production environment is specified* ( see below ) also builds a self-executable bundle of all JS assets and modifies `/public/index.html` to load said bundle rather than javascript modules via SystemJS.

`gulp xxx [-e, --environment] [development*, production]`
> * Configures either gulp task for `development` or `production` needs.
> * Almost all task configuration can be found in `/gulp/config.js`. Some use the environment flag to determine appropriate settings.
> * All tasks default to `development`.

---
#### Configuration:

`/assets/javascripts/config.js` is used for global application settings, and can be imported by any module in your application. However, please note that it is also injected with the environment variables that the application was built under, found in `/gulp/config.js`.

#### Use `debug` instead of `console.log`

Instead of `console.log` statements include the following in your modules:

```
import _debug from 'debug';
const debug = _debug('re:<module-name>');
// ...
debug('A value to show in console:', value);
// or...
debug('My object as json: %j', jsonValue);
// or ... with strings
debug('string 1: %s -- string 2: %s', 'foo', 'bar');
// or %d for numbers
```
to enable some or all debugging out put, you should set 
```
localStorage.debug = 're:*'
```

or to only show for specific modules, `

```
localStorage.debug = 're:index,re:mymodule'
```

By default, `re:*` is enabled in the `index-client.js` module when environment = development.

### Considerations

I have to give some credit to `davezuko/react-redux-starter-kit`:https://github.com/davezuko/react-redux-starter-kit
Many tools and conventions here lifted directly from it.

**Notable differences:**
* Uses semicolons ;)
* JSPM Workflow instead of Webpack
* We have no JS module hot-reloading :( *for now...*
* Hangs on to Gulp for more familiar, moduler, extendable, free-form control over build tool-ery. This helps me keep more noddley build tasks like our iconfont generator in the mix without having to rewrite them.
* Avoids CSS moudles for now, giving us the usual bourbon/neat based set up we're used to from our website work.

**Notes:**
This setup uses react-router 2.x which is still in RC. The docs for react-router are still 1.x focused, so here's the "Upgrade Guide" to tide us over: https://github.com/rackt/react-router/blob/master/upgrade-guides/v2.0.0.md

-----

<a name="universal"></a>
## Reagent Universal Rendering for ExpressJS-based Server Apps

Universal Features have been added to Reagent 

**Quick Start for Server Rendering**

```
git clone git@bitbucket.org:EMN/reagent.git && cd reagent
git checkout universal
make bootstrap  # this runs npm i, jspm i and make install-server
gulp & npm run server  # gulp will be backgrounded; or you can run each in sep. terminal session
```

Hit the server at: [http://localhost:9090/](http://localhost:9090/) or change `gulp/config.js` to proxy through this
and use normal gulp localhost url.


**What's Changed?**

* `package.json` has an extra section now named `serverDependencies`. These are used to install Express
requirements when either `make install-server` is run, or more directly, `shell/install-server`.

* Added `express-middleware` to Reagent. This can be included into any _ExpressJS_-based App fairly easily.
You need to include the main middleware module in your App, and pass it configuration (a default config is provided).
See `server/app.js` for the typical usage.

*  When running Universal, only `index-client.js` and `index-server.js` are used; when running w/out server, using Gulp only, `index.html` is used. The included minimal Server app specifically ignores `index.html` by telling the `server-static` not to use directory index:

```
// disable directory indexing so we don't pick up Reagent's /index.html
app.use(express.static(path.join(__dirname, '../public'), { index: false }));
```

* `index.html.js` has been pulled in from the FeathersJS project for Universal rendering. It is mostly unchanged from the Feathers version.

* Component `Bar.js` has example of new pre-fetching through the static `needs` property of Route components.

* __React-Helmet__ and __React-GA__ and __exenv__ have been added to dependencies.

* Reagent now has the npm [__debug__](https://github.com/visionmedia/debug#browser-support) module in use for Browser. The debug output is controlled through `localStorage.debug`.
  It is enabled automatically for pattern `re:*` in module `index-client.js` from this line (in development):
  ```
  if (config.__DEBUG__) {
    if (window.localStorage) { localStorage.debug = 're:*' }
      ...
  ```

**Stuff you can Delete:**

If you only need Reagent for client rendering, you are free to delete the following:

```
rm -rf \
  server \
  assets/javascripts/express-middleware \
  assets/javascripts/index-client.js \
  assets/javascripts/index-server.js \
  assets/javascripts/index.html.js
```

If you're rendering universally:

```
rm assets/javascripts/index.html
```
