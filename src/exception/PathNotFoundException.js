'use strict';

const Exception = require('js-lang-exception');

const ID = 1003;

module.exports = class PathNotFoundException extends Exception {

    /**
     * @return {number} Exception ID
     */
    static get ID() {
        return ID;
    }

    constructor(pathName, glob) {
        if (typeof glob === 'string') {
            super(`Path not found with name: "${pathName}", glob: "${glob}"'`, ID);
        } else {
            super(`Path not found with name: "${pathName}"'`, ID);
        }
    }
};
