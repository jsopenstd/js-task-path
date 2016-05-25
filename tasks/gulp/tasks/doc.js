"use strict";

const use = require("rekuire"),

      gulp     = require("gulp"),
      remove   = require("del"),
      doc      = require("gulp-jsdoc-to-markdown"),
      rename   = require("gulp-rename"),
      sequence = require("gulp-sequence"),
      debug    = require("gulp-debug"),

      Paths = use("tasks/gulp/helpers/paths");

gulp.task("doc::clear", function(cb) {
    var folder = Paths.getPath("doc");

    remove(
        [
            folder + "/**/.*", // include . (dot) files and folders
            folder + "/**/*"
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
        .src(Paths.getPath("src") + "/**/*.js")
        /*
        .pipe(doc({
            template : "{{>main-index~}}{{>all-docs~}}"
        }))
        */
        .pipe(doc({
            /*
                template : {
                main : "/vagrant/tasks/gulp/tasks/doc/partials/main.hbs"
            },
            */
            plugin : ["/vagrant/tasks/gulp/tasks/doc/lib/dmd-plugin-example.js"]
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
    gulp.watch(Paths.getPath("src") + "/**/*.js", ["doc"]);
});
