"use strict";

const use = require("rekuire"),

      gulp     = require("gulp"),
      remove   = require("del"),
      doc      = require("gulp-jsdoc-to-markdown"),
      rename   = require("gulp-rename"),
      sequence = require("gulp-sequence"),
      debug    = require("gulp-debug"),

      Paths = use("script/gulp/helpers/paths");

gulp.task("doc::clear", function(cb) {
    var folder = Paths.getPath("doc");

    remove(
        [
            folder + "/**/.*", // include . (dot) files and folders
            folder + "/**/*",

            "!" + folder + "/**/.git*" // do not remove .git or any git-related files
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

gulp.task("doc::generate", function() {

    return gulp
        .src(Paths.getPath("src/*"))
        .pipe(doc({
            plugin : [Paths.getPath("doc-template")]
        }))
        .pipe(rename({
            extname : ".md"
        }))
        .pipe(gulp.dest(Paths.getPath("doc")));
});

gulp.task(
    "doc",
    function(cb) {
        sequence(
            "doc::clear",
            "doc::generate"
        )(cb);
    }
);

gulp.task("watch::doc", function() {
    gulp.watch(Paths.getPath("doc/watch"), ["doc"]);
});
