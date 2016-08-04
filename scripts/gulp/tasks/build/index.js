const gulp       = require('gulp'),
      remove     = require('del'),
      merge      = require('merge2'),
      compressor = require('gulp-uglify'),
      header     = require('gulp-header'),
      rename     = require('gulp-rename'),
      sequence   = require('gulp-sequence'),
      debug      = require('gulp-debug');

gulp.task(
    'tasks/build.clear',
    function(cb) {
        remove.sync(
            [
                '../../cov',
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
    'tasks/build.build',
    function() {
        var template     = require('../../../../src/license-header-template.json').template;
        var package_json = require('../../../../package.json');
        var data = {
            name    : package_json.name,
            version : package_json.version,
            author  : package_json.author.name,
            email   : package_json.author.email
        };

        return merge(
            gulp
                .src('../../src/*.js')
                .pipe(gulp.dest('../../dist')),

            gulp
                .src('../../src/*.js')
                .pipe(compressor())
                .pipe(header(template, data))
                .pipe(
                    rename({
                        extname : '.min.js'
                    })
                )
                .pipe(gulp.dest('../../dist'))
        );
    }
);

gulp.task(
    'tasks/build',
    function(cb) {
        sequence(
            'tasks/build.clear',
            'tasks/build.build'
        )(cb);
    }
);
