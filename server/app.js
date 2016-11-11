var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var path = require('path');
var routes = require('./routes/index');
var users = require('./routes/users');
var debug = require('debug')('server:app 🏁 ');


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev', {
  // filter out jspm requests
  skip: function (req, res) { return res.statusCode < 400 }
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// disable directory indexing so we don't pick up Reagent's /index.html
app.use(express.static(path.join(__dirname, '../public'), { index: false }));

// --------- SSR MIDDLEWARE INSTANTIATION ------------
  //  NOTE: can probably also use the the "src" versions of these, rather than compiled
  var ssr = require('../public/assets/javascripts/express-middleware/render-server');
  var ssrConfig = require('../public/assets/javascripts/express-middleware/render-server').DefaultConfig;
  // SSR entry module path is relative to reagent public dir, override these if you want
  // ssrConfig.entry = 'assets/javascripts/index-server';
  // ssrConfig.htmlTemplate = 'assets/javascripts/index.html.js'
  app.use('/', ssr(ssrConfig));
// ----- End SSR Config ------


app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


process.on('unhandledRejection', (reason, p) => {
  debug('WARNING: Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});


module.exports = app;
