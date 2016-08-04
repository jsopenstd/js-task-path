const gulp     = require('gulp'),
      sequence = require("gulp-sequence"),
      debug    = require('gulp-debug');

gulp.task(
    'tasks/ci',
    function(cb) {
        sequence(
            'tasks/build',
            'tasks/test'
        )(cb);
    }
);
