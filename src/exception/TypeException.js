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
const ID = 1004;

/**
 * Exception, when the optional argument "options" must be an object.
 *
 * @class TypeException
 * @memberOf js.task.path.exception
 */
module.exports = class TypeException extends Exception {

    /**
     * @return {number} Exception ID
     */
    static get ID() {
        return ID;
    }

    constructor(options) {
        const type = typeof options;

        super(`The optional argument "options" must be an object, got:"${type}"`, ID);
    }
};
