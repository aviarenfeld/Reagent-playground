var gulp         = require('../config').gulp;
var replace      = require('gulp-replace');
var browserSync  = require('browser-sync');
var eslint       = require('gulp-eslint');
var handleErrors = require('../util/handleErrors');
var jspm         = require('jspm');
var config       = require('../config').javascripts;

gulp.task('lint', function() {
  return gulp.src(config.src)
        .pipe(eslint())
        .pipe(eslint.format());
});

gulp.task('javascripts-config', function(){
  return gulp.src(config.configfile)
        .pipe( replace( '[options]', JSON.stringify( config.options ) ) )
        .pipe( gulp.dest(config.dest));
});

gulp.task('javascripts', ['lint', 'javascripts-config'], function() {
  return gulp.src( config.src )
        .pipe(gulp.dest(config.dest));
});

// Not used. Seems to put dependencies ( Rect ) in to some kind of
// "production mode" supressing useful developer warnings.
gulp.task('bundle-vendor', function( callback ) {
  jspm.setPackagePath('.');
  jspm.bundle(
    config.vendor.entry,
    config.vendor.dest,
    {
      minify: false,
      sourceMaps: true,
      mangle: false,
      buildCSS: false,
      inject: true
    }
  )
  .then( callback )
  .catch(function( err ) {
    console.log('Bundle Error:', err);
  });
});

gulp.task('bundle', ['lint'], function( callback ) {
  jspm.setPackagePath('.');
  jspm.bundleSFX(
    config.bundle.entry,
    config.bundle.dest,
    {
      minify: true,
      sourceMaps: true,
      mangle: false,
      buildCSS: false
    }
  )
  .then( callback )
  .catch(function( err ) {
    console.log('Bundle Error:', err);
  });
});
