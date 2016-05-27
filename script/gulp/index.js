"use strict";

const use   = require("rekuire"),

      gulp  = require("gulp"),
      debug = require("gulp-debug"),

      Paths = use("helpers/paths");

// add paths
Paths.addPath("gulp",        Paths.getPath("root") + "/script/gulp");
Paths.addPath("gulp/tasks",  Paths.getPath("root") + "/script/gulp/tasks");

Paths.addPath("dist",        Paths.getPath("root") + "/dist");
Paths.addPath("src",         Paths.getPath("root") + "/src");
Paths.addPath("doc",         Paths.getPath("root") + "/doc");
Paths.addPath("test",        Paths.getPath("root") + "/test");
Paths.addPath("coverage",    Paths.getPath("root") + "/coverage");

Paths.addPath("src/*", Paths.getPath("src") + "/**/*.js");

Paths.addPath("package.json", Paths.getPath("root") + "/package.json");
Paths.addPath("source-file",  Paths.getPath("src") + "/paths.js");
Paths.addPath("dist-file",    Paths.getPath("dist") + "/paths.js");
Paths.addPath("test-file",    Paths.getPath("test") + "/index.js");
Paths.addPath("doc-template", Paths.getPath("gulp/tasks") + "/doc-template/index.js");

Paths.addPath("build/watch", Paths.getPath("src") + "/**/*.js");
Paths.addPath("doc/watch",   Paths.getPath("src") + "/**/*.js");

// load tasks
use("/tasks/build");
use("/tasks/test");
use("/tasks/watch");
use("/tasks/bump");
use("/tasks/doc");
use("/tasks/ci");

// the default task is left here for quick testing purposes
gulp.task("default", function() {
    var src = Paths.getPath("src");

    return gulp
        .src([
            src + "/**/.*", // include . (dot) files and folders
            src + "/**/*"
        ])
        .pipe(debug());
});
