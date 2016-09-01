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

        '.removeFrom()' : () => {
            const root = path.getRoot();

            path.set('src', '<root>/src');

            assert.deepStrictEqual(
                path.getAll(),
                {
                    src  : root + '/src',
                }
            );

            path.appendTo('src', '<root>/src/another-path/');

            assert.deepStrictEqual(
                path.get('src'),
                [
                    root + '/src',
                    root + '/src/another-path/',
                ]
            );

            path.removeFrom('src', '<root>/src');

            assert.deepStrictEqual(
                path.getAll(),
                {
                    src  : [
                        root + '/src/another-path/',
                    ],
                }
            );
        },
    }
};
