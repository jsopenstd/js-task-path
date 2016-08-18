'use strict';

const Exception = require('js-lang-exception');

module.exports = class PathNotFoundException extends Exception {

    constructor(pathName, glob = null) {
        if (glob !== null) {
            super(`Path not found with name: "${pathName}", glob: "${glob}"'`, 1000);
        } else {
            super(`Path not found with name: "${pathName}"'`, 1000);
        }
    }
};
