const gulp  = require('gulp'),
      debug = require('gulp-debug');

require('./tasks/build');
require('./tasks/test');
require('./tasks/bump');
require('./tasks/ci');

gulp.task('default', function() {
    return gulp;
});
