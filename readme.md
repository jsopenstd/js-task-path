# js-task-paths (Paths)

[![Recent Version][npm-badge]][npm-url]
[![Travis CI - Build Status][travis-badge]][travis-url]
[![Coveralls - Code Coverage Status][coverage-badge]][coverage-url]
[![David - Dependencies][dependencies-badge]][dependencies-url]
[![Gitter - Repository Chat][chat-badge]][chat-url]

![js-task-paths][logo]

## Synopsis

A utility singleton to help manage task-related paths more easily throughout the whole project.

## Install

```
npm install js-task-paths
```

## Usage

For additional examples,
check the **[test folder](https://github.com/jsstd/js-task-paths/tree/master/test)**

```javascript
const paths = require("js-task-paths");

// add general paths
paths.addPath("dist",  "<root>/dist");
paths.addPath("src",   "<root>/src");
paths.addPath("doc",   "<root>/doc");
paths.addPath("tasks", "<root>/tasks");
paths.addPath("tests", "<root>/tests");

// use previously given, custom paths via token
paths.addPath("build-tasks", "<tasks>/build/*.js");

// add individual files
paths.addPath("source-file", "<src>/src.js");
paths.addPath("dist-file",   "<dist>/dist.js");

// get paths by name
paths.getPath("source-file");
paths.getPath("dist-file");

// example, when using gulp
gulp.task("build::copy-source", function() {
    return gulp
        .src(paths.getPath("source-file"))
        .pipe(
            gulp.dest(paths.getPath("dist")
        ));
});

// example, when using gulp, using shorter paths aliases
// for shorter paths aliases, check the documentation
gulp.task("build::copy-source", function() {
    return gulp
        .src(paths.get("source-file"))
        .pipe(
            gulp.dest(paths.get("dist")
        ));
});
```

## Documentation

The API documentation can be found on the [repository's wiki page](https://github.com/jsstd/js-task-paths/wiki/paths).

Check out **function aliases** in order to use this tool efficiently (shorter function names => less typing).

## Issues

If you find any bugs and other issues, check the
[GSDC Guide - Issues](https://github.com/openstd/general-software-development-contribution-guide#issues)
section on how to submit issues in a standardized way on
[the project's issues page](https://github.com/jsstd/js-task-paths/issues).

In case you have any suggestions regarding the project (features, additional capabilities, etc.), check the
[GSDC Guide - Suggestions](https://github.com/openstd/general-software-development-contribution-guide#suggestions)
section on how to submit suggestions in an easy, standardized way on
[the project's issues page](https://github.com/jsstd/js-task-paths/issues).

## Contribution

In order to contribute to this project, check the
[GSDC Guide](https://github.com/openstd/general-software-development-contribution-guide)
for an easy, standardized way on how to contribute to projects.

## Support

If you **by any means** find this project useful,
[consider supporting the project](http://richrdkng.github.io/support).

There are multiple options to support the project and the developer and any means of support is beneficial and helpful.

## License

[MIT](license.md) @ Richard King

[logo]:               https://cdn.rawgit.com/jsstd/js-task-paths/master/logo/logo.png

[npm-badge]:          https://img.shields.io/npm/v/js-task-paths.svg
[npm-url]:            https://www.npmjs.com/package/js-task-paths

[travis-badge]:       https://travis-ci.org/jsstd/js-task-paths.svg?branch=master
[travis-url]:         https://travis-ci.org/jsstd/js-task-paths

[coverage-badge]:     https://coveralls.io/repos/github/jsstd/js-task-paths/badge.svg?branch=master
[coverage-url]:       https://coveralls.io/github/jsstd/js-task-paths

[dependencies-badge]: https://david-dm.org/jsstd/js-task-paths.svg
[dependencies-url]:   https://david-dm.org/jsstd/js-task-paths

[chat-badge]:         https://badges.gitter.im/jsstd/js-task-paths.svg
[chat-url]:           https://gitter.im/jsstd/js-task-paths?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge

[development-badge]:  http://img.shields.io/badge/download-DEVELOPMENT-brightgreen.svg
[development-url]:    https://cdn.rawgit.com/jsstd/js-task-paths/master/src/typeof.js

[production-badge]:   http://img.shields.io/badge/download-PRODUCTION-red.svg
[production-url]:     https://cdn.rawgit.com/jsstd/js-task-paths/master/dist/typeof.min.js

[repository-badge]:   http://img.shields.io/badge/download-REPOSITORY+DOCUMENTATION-orange.svg
[repository-url]:     https://cdn.rawgit.com/jsstd/js-task-paths/master/dist/repository.zip
