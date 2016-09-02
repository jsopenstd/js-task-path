'use strict';

const Exception = require('js-lang-exception');

/**
 * @private
 * @const {number} ID
 */
const ID = 1001;

/**
 * Exception, when the glob must be a string or an array.
 *
 * @namespace js.task.Path.exception
 * 
 * @class InvalidGlobException
 * @extends js.lang.Exception
 *
 * @memberOf js.task.Path.exception
 */
module.exports = class InvalidGlobException extends Exception {

    /**
     * The ID of the exception.
     *
     * @returns {number} Exception ID.
     */
    static get ID() {
        return ID;
    }

    constructor(glob) {
        const type = typeof glob;

        super(`Invalid glob, the glob most be a string or an array, got: "${type}"`, ID);
    }
};
