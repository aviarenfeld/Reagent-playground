require('dotenv').config({ silent: true });
minimist = require('minimist');
var options = minimist(process.argv);
var environment = options.environment || options.e || 'development';
var historyApiFallback = require('connect-history-api-fallback');
var gutil = require('gulp-util');

// Output Environment:
if ( options.environment || options.e ) {
  console.log('Environment: ' + environment );
} else {
  console.log('Environment: ' + environment + ' (default)' );
}

var path = {
  src  : './assets',
  dest : './public/assets'
}

// NFL React-Helmet module
var HELMET_DEFAULT = {
  title: 'Reagent',
  defaultTitle: 'Reagent',
  titleTemplate: '%s | Reagent',
  meta:[
    { 'name': 'description', 'content': 'Reagent Description'  },
    { property: 'og:type', content: 'website' },
    { property: 'og:site_name', content: 'Reagent' },
    { property: 'og:description', content: 'Facebook Description of Web site' }
  ]
}

var options = {
  development: {
    __DEBUG__ : true,
    __DEBUG_NEW_WINDOW__: options.nw,
    __BASENAME__ : '',
    __INITIAL_STATE__: {},
    GA_TRACKING_ID: '',
    HELMET: HELMET_DEFAULT,
  },
  production: {
    __DEBUG__ : false,
    __DEBUG_NEW_WINDOW__: false,
    __BASENAME__ : '',
    __INITIAL_STATE__: {},
    GA_TRACKING_ID: '',
    HELMET: HELMET_DEFAULT,
  }
}

var gulp     = require('gulp');
var gulp_src = gulp.src;
var plumber  = require('gulp-plumber');
gulp.src = function() {
  return gulp_src.apply(gulp, arguments)
    .pipe(plumber(function(error) {
      // Output an error message
      gutil.log(gutil.colors.red('Error (' + error.plugin + '): ' + error.message));
      // emit the end event, to properly end the task
      this.emit('end');
    })
  );
};

module.exports = {
  gulp        : gulp,
  path        : path,
  environment : environment,
  browserSync : {

    // If this is a stand-alone app, use the build-in static server:
    server : {
      baseDir: './public',
      middleware: [ historyApiFallback() ]
    },

    // OR: Proxy an EXISTING host, such as a Rails or WP site:
    // proxy  : 'http://localhost:9090',

    // If BS should watch output files for you, provide paths to watch:
    // files  : ['./public/index.html', './public/assets/**/**.*'],

    open   : false,
    notify : false
  },
  sass: {
    src      : path.src + '/stylesheets/**/*.scss',
    dest     : path.dest + '/stylesheets',
    settings : {
      outputStyle  : environment === 'production' ? 'compressed' : 'nested',
      includePaths : require('node-neat').includePaths
    }
  },
  images: {
    src  : path.src + '/images/**',
    dest : path.dest + '/images'
  },
  symbols: {
    name           : 'Symbols',
    src            : path.src + '/symbols/svg/*.svg',
    dest           : path.dest + '/fonts',
    sassDest       : path.src + '/stylesheets/base',
    template       : './gulp/tasks/symbols/template.sass',
    sassOutputName : '_symbols.sass',
    fontPath       : '/assets/fonts',
    className      : 'ico',
    options        : {
      fontName         : 'symbols',
      appendCodepoints : true,
      normalize        : false
    }
  },
  javascripts : {
    src    : [ path.src + '/javascripts/**/*.js', '!' + path.src + '/javascripts/config.js' ],
    dest   : path.dest + '/javascripts',

    serverIndex : './server/app.js',

    configfile : path.src + '/javascripts/config.js',
    options    : options[ environment ],
    bundle : {
      entry : path.dest + '/javascripts/index-client',
      dest  : path.dest + '/javascripts/main.bundle.js'
    },
    vendor : {
      entry : path.dest + '/javascripts/**/* - [' + path.dest + '/javascripts/**/*]',
      dest  : path.dest + '/vendor.bundle.js'
    }
  },
  html : {
    src  : path.src + '/index.html',
    dest : './public',
    root : environment === 'production' ? '/' : '/'
  }
};
