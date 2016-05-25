const use   = require("rekuire"),

      gulp     = require("gulp"),
      mkdir    = require("mkdirp"),
      remove   = require("del"),
      zip      = require("gulp-zip"),
      sequence = require("gulp-sequence"),
      debug    = require("gulp-debug"),

      Paths = use("tasks/gulp/helpers/paths");

const TEMP_DEV  = ".temp-pack-dev",
      TEMP_PROD = ".temp-pack-prod";

const ARCHIVE_DEV  = "_development.zip",
      ARCHIVE_PROD = "_production.zip";

var tempFolder,
    archiveName,
    glob;

gulp.task("pack::pack-create-temp", function(cb) {
    const path = Paths.getPath("root") + "/" + tempFolder;

    mkdir(
        path,
        {},
        function(error) {
            if (error) {
                console.log(arguments);
            }

            cb();
        }
    );
});

gulp.task("pack::pack-copy-to-temp", function() {
    const dest = Paths.getPath("root") + "/" + tempFolder;

    return gulp
        .src(glob)
        .pipe(gulp.dest(dest));
});

gulp.task("pack::pack-from-temp", function() {
    const path = Paths.getPath("root") + "/" + tempFolder + "/**/*.*";

    return gulp
        .src(path)
        .pipe(zip(archiveName))
        .pipe(gulp.dest(Paths.getPath("dist")));
});

gulp.task("pack::pack-delete-temp", function(cb) {
    const path = Paths.getPath("root") + "/" + tempFolder;

    remove(
        path,
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

gulp.task("pack::pack-dev-prepare", function(cb) {
    tempFolder  = TEMP_DEV;
    archiveName = ARCHIVE_DEV;
    glob        = [
        Paths.getPath("root") + "/readme.md",
        Paths.getPath("root") + "/*doc/**/*",
        Paths.getPath("root") + "/*src/**/*"
    ];

    cb();
});

gulp.task("pack::pack-prod-prepare", function(cb) {
    tempFolder  = TEMP_PROD;
    archiveName = ARCHIVE_PROD;
    glob        = [
        Paths.getPath("root") + "/readme.md",
        Paths.getPath("root") + "/dist/**/*.js"
    ];

    cb();
});

gulp.task(
    "pack::pack-dev",
    sequence(
        "pack::pack-dev-prepare",
        "pack::pack-create-temp",
        "pack::pack-copy-to-temp",
        "pack::pack-from-temp",
        "pack::pack-delete-temp"
    )
);

gulp.task(
    "pack::pack-prod",
    sequence(
        "pack::pack-prod-prepare",
        "pack::pack-create-temp",
        "pack::pack-copy-to-temp",
        "pack::pack-from-temp",
        "pack::pack-delete-temp"
    )
);

gulp.task(
    "pack",
    sequence(
        "pack::pack-dev",
        "pack::pack-prod"
    )
);
