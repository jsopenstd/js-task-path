'use strict';

const assert        = require('assert'),
      vars          = require('../variables'),
      isString      = require('js-partial-is-string'),
      isEmptyString = require('js-partial-is-empty-string'),
      path          = require(vars.path);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            path.reset();
        },

        '.getRoot()' : () => {
            assert(isString(path.getRoot()));
            assert( ! isEmptyString(path.getRoot()));
        },

        '.setRoot()' : () => {
            const originalRoot = path.getRoot(),
                  customRoot   = '/www/path-root';

            path.setRoot(customRoot);

            assert(path.getRoot() === customRoot);

            path.setRoot(originalRoot);

            assert(path.getRoot() === originalRoot);
        },
    }
};
