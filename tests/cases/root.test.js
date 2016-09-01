'use strict';

const assert        = require('assert'),
      vars          = require('../variables'),
      isString      = require('js-partial-is-string'),
      isEmptyString = require('js-partial-is-empty-string'),
      path          = require(vars.path),

      InvalidGlobException     = require(vars.exception.InvalidGlobException),
      InvalidPathNameException = require(vars.exception.InvalidPathNameException),
      PathNotFoundException    = require(vars.exception.PathNotFoundException),
      TypeException            = require(vars.exception.TypeException);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            // reset options
            path.setOptions(path.DEFAULTS);

            // reset paths by removing all
            path.removeAll();
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
