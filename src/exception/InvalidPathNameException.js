'use strict';

const Exception = require('js-lang-exception');

module.exports = class InvalidPathNameException extends Exception {

    constructor(pathName) {
        super(`Invalid path name, the path name must be a non-empty string, got: "${pathName}"'`, 1000);
    }
};
