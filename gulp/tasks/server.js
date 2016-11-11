var gulp    = require('../config').gulp;
const spawn = require('child_process').spawn;

function cb (err, stdout, stderr) {
  // Node.js will invoke this callback when the
  console.log(stdout);
};

gulp.task('server', [], function(cb) {
  var express = spawn('npm', ['run', 'server'], {stdio: 'inherit'});

  process.on('exit', function () {
    console.log('\nKilling Express server');
    express.kill();
  });
});
