"use strict";

const use   = require("rekuire"),

      gulp  = require("gulp"),
      debug = require("gulp-debug"),

      Paths = use("script/gulp/helpers/paths");

gulp.task("watch", function() {
    gulp.watch(Paths.getPath("watch"), ["build"]);
});
