'use strict';

const assert = require('assert'),
      vars   = require('../variables'),

      path = require(vars.path),

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

        '.has()' : () => {
            const root = path.getRoot();

            path.set('src', '<root>/src');

            assert(path.has('src')  === true);
            assert(path.has('dist') === false);

            assert.deepStrictEqual(
                path.getAll(),
                {
                    src : `${root}/src`,
                }
            );
        },
    }
};
