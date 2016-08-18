'use strict';

const Exception = require('js-lang-exception');

const ID = 1002;

module.exports = class InvalidPathNameException extends Exception {

    /**
     * @return {number} Exception ID
     */
    static get ID() {
        return ID;
    }

    constructor(pathName) {
        super(`Invalid path name, the path name must be a non-empty string, got: "${pathName}"'`, ID);
    }
};
