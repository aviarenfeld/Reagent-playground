/* Notes:
   - gulp/tasks/browserSync.js watches and reloads compiled files
*/

var gulp   = require('../config').gulp;
var config = require('../config');
var watch  = require('gulp-watch');

gulp.task('watch', ['browser-sync'], function(callback) {
  watch(config.sass.src, function() { gulp.start('sass'); });
  watch(config.images.src, function() { gulp.start('images'); });
  watch(config.javascripts.src, function() { gulp.start('javascripts'); });
  watch(config.javascripts.src, function() { gulp.start('touch-server'); });
  watch(config.javascripts.configfile, function() { gulp.start('javascripts-config'); });
  watch(config.html.src, function() { gulp.start('html'); });
  // gulp.start('server');
});
