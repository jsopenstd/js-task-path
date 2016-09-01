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

        '.contains()' : {
            'single path' : () => {
                path.set('src', '<root>/src');

                assert(path.contains('src', '<root>/src')  === true);
                assert(path.contains('src', '<root>/dist') === false);
            },
            'multiple paths' : () => {
                path.set(
                    'src',
                    [
                        '<root>/src',
                        '<root>/dist',
                    ]
                );

                assert(path.contains('src', '<root>/src')  === true);
                assert(path.contains('src', '<root>/dist') === true);
            },
        },
    }
};
