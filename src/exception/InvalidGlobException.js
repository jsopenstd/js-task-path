'use strict';

const Exception = require('js-lang-exception');

/**
 * @private
 * @const {number} ID
 */
const ID = 1001;

/**
 *
 * @class InvalidGlobException
 * @extends js.lang.Exception
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
