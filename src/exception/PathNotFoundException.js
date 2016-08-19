'use strict';

const Exception = require('js-lang-exception'),
      isString  = require('js-partial-is-string');

const ID = 1003;

module.exports = class PathNotFoundException extends Exception {

    /**
     * @return {number} Exception ID
     */
    static get ID() {
        return ID;
    }

    constructor(pathName, glob) {
        if (isString(glob)) {
            super(`Path not found with name: "${pathName}", glob: "${glob}"'`, ID);
        } else {
            super(`Path not found with name: "${pathName}"'`, ID);
        }
    }
};
