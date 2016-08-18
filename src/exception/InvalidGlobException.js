'use strict';

const Exception = require('js-lang-exception');

module.exports = class InvalidGlobException extends Exception {

    constructor(glob) {
        let type = typeof glob;

        super(`Invalid glob, the glob most be a string or an array, got: "${type}"`, 1000);
    }
};
