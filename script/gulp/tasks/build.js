"use strict";

const use     = require("rekuire"),

      gulp     = require("gulp"),
      remove   = require("del"),
      rename   = require("gulp-rename"),
      header   = require("gulp-header"),
      sequence = require("gulp-sequence"),
      debug    = require("gulp-debug"),

      Paths   = use("script/gulp/helpers/paths");

gulp.task("build::clear", function(cb) {
    var dist = Paths.getPath("dist");

    remove(
        [
            dist + "/**/.*", // include . (dot) files and folders
            dist + "/**/*"
        ],
        {
            force : true
        }
    )
    .then(
        // success
        function() {
            cb();
        },
        // error
        function() {
            console.log(arguments);
            cb();
        }
    );
});

// copy the source into /dist
gulp.task("build::copy-source", function() {
    return gulp
        .src(Paths.getPath("source-file"))
        .pipe(gulp.dest(Paths.getPath("dist")));
});

gulp.task(
    "build::build",
    function(cb) {
        sequence(
            "build::copy-source"
        )(cb);
    }
);

gulp.task(
    "build",
    function(cb) {
        sequence(
            "build::clear",
            "build::build"
        )(cb);
    }
);

Paths.appendToPath("watch", Paths.getPath("build/watch"));
