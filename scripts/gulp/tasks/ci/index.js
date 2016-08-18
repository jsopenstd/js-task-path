'use strict';

const gulp      = require(`gulp`),
      coveralls = require(`gulp-coveralls`),
      sequence  = require(`gulp-sequence`),
      debug     = require(`gulp-debug`);

gulp.task(
    `tasks/submit-to-coveralls`,
    () => {
        return gulp
            .src(`../../cov/**/lcov.info`)
            .pipe(coveralls());
    }
);

gulp.task(
    `tasks/ci`,
    (cb) => {
        sequence(
            `tasks/build`,
            `tasks/test`,
            `tasks/submit-to-coveralls`
        )(cb);
    }
);
