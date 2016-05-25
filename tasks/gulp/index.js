const use   = require("rekuire"),

      gulp  = require("gulp"),
      debug = require("gulp-debug"),

      Paths = use("helpers/paths");

// add paths
Paths.addPath("gulp",        Paths.getPath("root") + "/tasks/gulp");
Paths.addPath("gulp/tasks",  Paths.getPath("root") + "/tasks/gulp/tasks");

Paths.addPath("dist",        Paths.getPath("root") + "/dist");
Paths.addPath("src",         Paths.getPath("root") + "/src");
Paths.addPath("doc",         Paths.getPath("root") + "/doc");
Paths.addPath("tests",       Paths.getPath("root") + "/tests");

Paths.addPath("source-file", Paths.getPath("root") + "/src/paths.js");
Paths.addPath("dist-file",   Paths.getPath("root") + "/dist/paths.js");

// load tasks
use("/tasks/build");
use("/tasks/test");
use("/tasks/watch");
use("/tasks/bump");
use("/tasks/doc");
use("/tasks/ci");
use("/tasks/pack");

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
