'use strict';

const gulp     = require('gulp'),
      remove   = require('del'),
      sequence = require('gulp-sequence'),
      debug    = require('gulp-debug');

gulp.task(
    'tasks/build.clear',
    (cb) => {
        remove.sync(
            [
                '../../dist'
            ],
            {
                force : true
            }
        );

        cb();
    }
);

gulp.task(
    'tasks/build.copy',
    () => {
        return gulp
            .src('../../src/**/*.js')
            .pipe(gulp.dest('../../dist'));
    }
);

gulp.task(
    'tasks/build',
    (cb) => {
        sequence(
            'tasks/build.clear',
            'tasks/build.copy'
        )(cb);
    }
);
