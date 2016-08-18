'use strict';

const gulp  = require(`gulp`),
      debug = require(`gulp-debug`);

require(`./tasks/build`);
require(`./tasks/bump`);
require(`./tasks/test`);
require(`./tasks/ci`);

// left here for quick check whether gulp works
gulp.task(
    `default`,
    () => {
        return gulp;
    }
);
