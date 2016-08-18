'use strict';

const Exception = require('js-lang-exception');

module.exports = class TypeException extends Exception {

    constructor(options) {
        let type = typeof options;

        super(`The optional argument 'options' must be an object, got:'${type}'`, 1000);
    }
};
