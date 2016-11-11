var gulp        = require('../config').gulp;
var replace     = require('gulp-replace');
var remove      = require('gulp-remove-code');
var htmlmin     = require('gulp-htmlmin');
var config      = require('../config').html;
var environment = require('../config').environment;
var browserSync = require('browser-sync');

// HTML Index File
gulp.task('html', function() {
  var env = {};
  env[ environment ] = true;
  return gulp.src(config.src)
        .pipe(remove(env))
        .pipe(replace('[root]', config.root))
        .pipe(replace('[cachebuster]', new Date().getTime()))
        .pipe(htmlmin({removeComments:true}))
        .pipe(gulp.dest(config.dest))
        .pipe(browserSync.reload({stream:true}));
});
