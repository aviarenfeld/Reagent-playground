var gulp        = require('../config').gulp;
var sequence    = require('gulp-sequence');
var environment = require('../config').environment;

gulp.task('build', function(cb){
  var tasks = ['clean', 'symbols', [ 'images', 'sass', 'javascripts', 'html' ]];
  if ( environment === 'production' ) tasks.push( 'bundle' );
  tasks.push(cb);
  sequence.apply(this, tasks);
});

gulp.task('default', [], function(cb) {
  sequence( 'build', 'watch', cb );
});
