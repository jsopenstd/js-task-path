'use strict';

/**
 * @namespace js.task.path.exception
 */

const Exception = require('js-lang-exception'),
      isString  = require('js-partial-is-string');

/**
 * Exception ID.
 *
 * @private
 * @const {number} ID
 */
const ID = 1003;

/**
 * Exception, when path not found with name.
 *
 * @class PathNotFoundException
 * @memberOf js.task.path.exception
 */
module.exports = class PathNotFoundException extends Exception {

    constructor(pathName, glob) {
        if (isString(glob)) {
            super(`Path not found with name: "${pathName}", glob: "${glob}"'`, ID);
        } else {
            super(`Path not found with name: "${pathName}"'`, ID);
        }
    }
};
