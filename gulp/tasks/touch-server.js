var gulp   = require('../config').gulp;
var touch  = require('gulp-touch');
var config = require('../config').javascripts;

// when client files change, also need to get babel-watch to reload
// Express' server src files.
gulp.task('touch-server', ['javascripts'], function() {
  gulp.src(config.serverIndex)
    .pipe(touch());
});
