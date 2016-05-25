# ![js-task-paths][logo]

[![Recent Version][npm-badge]][npm-url]
[![Travis CI - Build Status][travis-badge]][travis-url]
[![Coveralls - Code Coverage Status][coverage-badge]][coverage-url]
[![David - Dependencies][dependencies-badge]][dependencies-url]
[![Gitter - Repository Chat][chat-badge]][chat-url]

## Synopsis

A utility singleton to help manage task-related paths more easily throughout the whole project.

## Getting Started

**NPM**

```
npm install js-task-paths
```

**Download**

[![Download Development][development-badge]][development-url]
Commented source code.

[![Download Production][production-badge]][production-url]
Minified code.

[![Download Repository][repository-badge]][repository-url]
In .zip.

## Usage

```javascript
const Paths = require("js-task-paths");

Paths.setRoot("<root>../");

Paths.addPath("dist", "<root>/");

```

[Link to Documentation](https://github.com/richrdkng/js-task-paths/wiki)

## Issues, Suggestions & Bugs

[Link to Issues](https://github.com/richrdkng/js-task-paths/issues)

## Contribution

[Link to contribution.md](contribution.md)

## Support

[Link to Support](http://richrdkng.github.io/support)

## License

[MIT](https://opensource.org/licenses/MIT) @ Richard King

[logo]:               logo/logo.png

[npm-badge]:          https://img.shields.io/npm/v/js-task-paths.svg
[npm-url]:            https://www.npmjs.com/package/js-task-paths

[travis-badge]:       https://travis-ci.org/richrdkng/js-task-paths.svg?branch=master
[travis-url]:         https://travis-ci.org/richrdkng/js-task-paths

[coverage-badge]:     https://coveralls.io/repos/github/richrdkng/js-task-paths/badge.svg?branch=master
[coverage-url]:       https://coveralls.io/github/richrdkng/js-task-paths

[dependencies-badge]: https://david-dm.org/richrdkng/js-task-paths.svg
[dependencies-url]:   https://david-dm.org/richrdkng/js-task-paths

[chat-badge]:         https://badges.gitter.im/richrdkng/js-task-paths.svg
[chat-url]:           https://gitter.im/richrdkng/js-task-paths?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge

[development-badge]:  http://img.shields.io/badge/download-DEVELOPMENT-brightgreen.svg
[development-url]:    https://cdn.rawgit.com/richrdkng/js-task-paths/master/src/typeof.js

[production-badge]:   http://img.shields.io/badge/download-PRODUCTION-red.svg
[production-url]:     https://cdn.rawgit.com/richrdkng/js-task-paths/master/dist/typeof.min.js

[repository-badge]:   http://img.shields.io/badge/download-REPOSITORY+DOCUMENTATION-orange.svg
[repository-url]:     https://cdn.rawgit.com/richrdkng/js-task-paths/master/dist/repository.zip
