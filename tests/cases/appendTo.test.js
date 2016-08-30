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
            // reset paths by removing all
            path.removeAll();
        },

        '.appendTo()' : () => {
            const root = path.getRoot();

            path.set('src', '<root>/src');

            assert.deepStrictEqual(
                path.getAll(),
                {
                    src  : root + '/src',
                }
            );

            let newGlob = path.appendTo('src', '<root>/src/another-path/');

            assert.deepStrictEqual(
                newGlob,
                [
                    root + '/src',
                    root + '/src/another-path/',
                ]
            );

            let removedGlob = path.removeFrom('src', '<root>/src');

            assert.deepStrictEqual(
                removedGlob,
                [
                    root + '/src',
                ]
            );

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
