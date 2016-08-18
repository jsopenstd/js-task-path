'use strict';

const Exception = require('js-lang-exception');

const ID = 1004;

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
