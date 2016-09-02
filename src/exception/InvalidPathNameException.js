'use strict';

/**
 * @namespace js.task.path.exception
 */

const Exception = require('js-lang-exception');

/**
 * Exception ID.
 *
 * @private
 * @const {number} ID
 */
const ID = 1002;

/**
 * Exception, when the path name must be a non-empty string.
 *
 * @class InvalidPathNameException
 * @memberOf js.task.path.exception
 */
module.exports = class InvalidPathNameException extends Exception {

    /**
     * @ignore
     * @return {number} Exception ID
     */
    static get ID() {
        return ID;
    }

    constructor(pathName) {
        super(`Invalid path name, the path name must be a non-empty string, got: "${pathName}"'`, ID);
    }
};
