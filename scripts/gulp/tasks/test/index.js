'use strict';

const gulp     = require('gulp'),
      mocha    = require('gulp-mocha'),
      coverage = require('gulp-istanbul'),
      sequence = require('gulp-sequence'),
      lint     = require('gulp-eslint'),
      debug    = require('gulp-debug'),
      vars     = require('../../../../tests/variables');

const setVars = () => {
    vars.path = '../../src/js-task-path.js';

    vars.exception.InvalidGlobException     = '../../src/exception/InvalidGlobException';
    vars.exception.InvalidPathNameException = '../../src/exception/InvalidPathNameException';
    vars.exception.PathNotFoundException    = '../../src/exception/PathNotFoundException';
    vars.exception.TypeException            = '../../src/exception/TypeException';
};

gulp.task(
    'tasks/test.src',
    () => {
        setVars();

        return gulp
            .src(
                '../../tests/cases/*.test.js',
                {
                    read : false
                }
            )
            .pipe(
                mocha({
                    ui : 'exports'
                })
            );
    }
);

gulp.task(
    'tasks/test.init-cov',
    () => {
        return gulp
            .src('../../src/**/*.js')
            .pipe(coverage())
            .pipe(coverage.hookRequire());
    }
);

gulp.task(
    'tasks/test.with-cov',
    [
      'tasks/test.init-cov'
    ],
    () => {
        setVars();

        return gulp
            .src(
                '../../tests/cases/*.test.js',
                {
                    read : false
                }
            )
            .pipe(
                mocha({
                    ui : 'exports'
                })
            )
            .pipe(
                coverage.writeReports({
                    dir : '../../cov'
                })
            )
            .pipe(
                coverage.enforceThresholds({
                    thresholds : {
                        global : 100 // enforce 100% coverage
                    }
                }
            ));
    }
);

gulp.task(
    'tasks/test.with-lint',
    [
        'tasks/test.src'
    ],
    () => {
        return gulp
            .src('../../src/**/*.js')
            .pipe(lint())
            .pipe(lint.format())
            .pipe(lint.failAfterError());
    }
);

gulp.task(
    'tasks/test',
    (cb) => {
        sequence(
            'tasks/test.src',
            'tasks/test.with-cov',
            'tasks/test.with-lint'
        )(cb);
    }
);
