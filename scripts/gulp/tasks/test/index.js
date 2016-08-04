const gulp     = require('gulp'),
      mocha    = require('gulp-mocha'),
      coverage = require('gulp-istanbul'),
      sequence = require("gulp-sequence"),
      lint     = require('gulp-eslint'),
      debug    = require('gulp-debug'),
      vars     = require('../../../../tests/variables');

gulp.task(
    'tasks/test-src',
    function() {
        vars.path = '../src/js-task-path.js';

        return gulp
            .src(
                '../../tests/tests.js',
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
    'tasks/test-dist-dev',
    function() {
        vars.path = '../dist/js-task-path.js';

        return gulp
            .src(
                '../../tests/tests.js',
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
    'tasks/test-dist-prod',
    function() {
        vars.path = '../dist/js-task-path.min.js';

        return gulp
            .src(
                '../../tests/tests.js',
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
    function() {
        return gulp
            .src('../../src/js-task-path.js')
            .pipe(coverage())
            .pipe(coverage.hookRequire());
    }
);

gulp.task(
    'tasks/test-src-with-cov',
    [
      'tasks/test.init-cov'
    ],
    function() {
        vars.path = '../src/js-task-path.js';

        return gulp
            .src(
                '../../tests/tests.js',
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
    'tasks/test-src-with-lint',
    [
        'tasks/test-src'
    ],
    function() {
        return gulp
            .src('../../src/js-task-path.js')
            .pipe(lint())
            .pipe(lint.format())
            .pipe(lint.failAfterError());
    }
);

gulp.task(
    'tasks/test',
    function(cb) {
        sequence(
            'tasks/test-dist-dev',
            'tasks/test-dist-prod',
            'tasks/test-src-with-cov',
            'tasks/test-src-with-lint'
        )(cb);
    }
);
