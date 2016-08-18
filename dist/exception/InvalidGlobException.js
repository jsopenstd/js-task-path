'use strict';

const Exception = require(`js-lang-exception`);

const ID = 1001;

module.exports = class InvalidGlobException extends Exception {

    /**
     * @return {number} Exception ID
     */
    static get ID() {
        return ID;
    }

    constructor(glob) {
        const type = typeof glob;

        super(`Invalid glob, the glob most be a string or an array, got: "${type}"`, ID);
    }
};
