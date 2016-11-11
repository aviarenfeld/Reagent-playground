var gulp         = require('../config').gulp;
var browserSync  = require('browser-sync');
var sass         = require('gulp-sass');
var sourcemaps   = require('gulp-sourcemaps');
var handleErrors = require('../util/handleErrors');
var config       = require('../config').sass;
var filter       = require('gulp-filter');

gulp.task('sass', function () {
  return gulp.src(config.src)
        .pipe(sourcemaps.init())
        .pipe(sass(config.settings))
        .on('error', handleErrors)
        .pipe(sourcemaps.write())
        .pipe(gulp.dest(config.dest))
        .pipe(filter('**/*.css'))
        .pipe(browserSync.reload({stream:true}));
});
