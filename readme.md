# js-task-path

[![Greenkeeper badge](https://badges.greenkeeper.io/nodewell/js-task-path.svg)](https://greenkeeper.io/)

[![Recent Version][npm-badge]][npm-url]
[![Travis CI - Build Status][travis-badge]][travis-url]
[![Coveralls - Code Coverage Status][cov-badge]][cov-url]
[![David - Dependencies][dep-badge]][dep-url]
[![David - DevDependencies][dev-dep-badge]][dev-dep-url]
[![Doclets][doclets-badge]][doclets-url]
[![Gitter - Repository Chat][chat-badge]][chat-url]

## Synopsis

A helper class to manage **task-**, **build-** and **deployment-related** paths more easily throughout 
the whole project. It provides an intuitive method to handle **path shortcuts for custom paths**.

- Written in **ES6**
- **Node-only**.

## Install

```
npm install js-task-path
```

## Usage

For additional examples,
check the **[unit tests](https://github.com/jsopenstd/js-task-path/tree/master/tests/cases)**

```javascript
const path = require('js-task-path');

// after require, you can use path right away without instantiation, since it's a singleton

// set custom paths
// '<root>' is present by default and its value is automatically determined and set to the package's root
path.set('dist', '<root>/dist');
path.set('src',  '<root>/src');
path.set('doc',  '<root>/doc');

// or use chaining
path.set('lib',      '<root>/lib')
    .set('scripts',  '<root>/scripts')
    .set('examples', '<root>/examples');
  
// or use the shorthand versions
path('tasks', '<root>/tasks');
path({
    tests : '<root>/tests',
    vars  : '<root>/vars'
});
    
// when setting paths, use previous paths with tokens
// also works with every form of path settings
path.set('test-cases', '<tests>/cases');

/*
default tokens (with 'root'):

'<root>'
'<<root>>'
'@root@'
'{@root@}'
'{%root%}'
'{{root}}'
*/

// use paths
path.get('dist'); // will be '<root>/dist', where <root> will be auto-resolved to package root (e.g.: '/vagrant/dist')

// or the shorthand version
path('dist');

// if the path constructed via different layers (e.g.: '<tests>/cases', where <tests> too is '<root>/tests'),
// the full path will be resolved.
path.get('test-cases'); // will be e.g.: '/vagrant/tests/cases'
```

## Documentation

Check the source 
[here](https://github.com/jsopenstd/js-task-path/blob/master/src/js-task-path.js)
since it's well structured and documented. Also you can find the rendered JSDoc documentation on 
[Doclets.io](https://doclets.io/jsopenstd/js-task-path/master). 

Also, check the [unit tests](https://github.com/jsopenstd/js-task-path/blob/master/tests/cases) 
in order to grasp the full-fledged capabilities.

Have fun! ;)

## Issues

If you find any bugs and other issues, check the
[GSDC Guide - Issues](https://github.com/openstd/general-software-development-contribution-guide#issues)
section on how to submit issues in a standardized way on
[the project's issues page](https://github.com/jsopenstd/js-task-path/issues).

In case you have any suggestions regarding the project (features, additional capabilities, etc.), check the
[GSDC Guide - Suggestions](https://github.com/openstd/general-software-development-contribution-guide#suggestions)
section on how to submit suggestions in an easy, standardized way on
[the project's issues page](https://github.com/jsopenstd/js-task-path/issues).

## Contribution

In order to contribute to this project, check the
[GSDC Guide](https://github.com/openstd/general-software-development-contribution-guide)
for an easy, standardized way on how to contribute to projects.

## Support

If you **by any means** find this project useful,
[consider supporting the organization](https://github.com/jsopenstd/jsopenstd/blob/master/support.md).

There are multiple options to support the project and the developers.
Any means of support is beneficial and helpful.

## License

[MIT](license.md) @ Richard King

[npm-badge]:     https://img.shields.io/npm/v/js-task-path.svg
[npm-url]:       https://www.npmjs.com/package/js-task-path

[travis-badge]:  https://travis-ci.org/jsopenstd/js-task-path.svg?branch=master
[travis-url]:    https://travis-ci.org/jsopenstd/js-task-path

[cov-badge]:     https://coveralls.io/repos/github/jsopenstd/js-task-path/badge.svg?branch=master
[cov-url]:       https://coveralls.io/github/jsopenstd/js-task-path

[dep-badge]:     https://david-dm.org/jsopenstd/js-task-path.svg
[dep-url]:       https://david-dm.org/jsopenstd/js-task-path

[dev-dep-badge]: https://david-dm.org/jsopenstd/js-task-path/dev-status.svg
[dev-dep-url]:   https://david-dm.org/jsopenstd/js-task-path#info=devDependencies

[doclets-badge]: https://img.shields.io/badge/style-on_doclets-brightgreen.svg?style=flat-square&label=docs
[doclets-url]:   https://doclets.io/jsopenstd/js-task-path/master   

[chat-badge]:    https://badges.gitter.im/jsopenstd/js-task-path.svg
[chat-url]:      https://gitter.im/jsopenstd/js-task-path?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge
