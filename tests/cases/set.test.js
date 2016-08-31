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

        '.set()' : {
            'multiple paths with single globs' : () => {
                const root = path.getRoot();

                path.set('dist', '<root>/dist');
                path.set('bin',  '<root>/bin');
                path.set('lib',  '<root>/lib');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        dist : `${root}/dist`,
                        bin  : `${root}/bin`,
                        lib  : `${root}/lib`,
                    }
                );
            },
            'one path, multiple globs' : () => {
                const root = path.getRoot();

                path.set(
                    'watch',
                    [
                        '<root>/dist',
                        '<root>/bin',
                        '<root>/lib',
                    ]
                );

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        watch : [
                            `${root}/dist`,
                            `${root}/bin`,
                            `${root}/lib`,
                        ],
                    }
                );
            },
            'chaining' : () => {
                const root = path.getRoot();

                path
                    .set('dist', '<root>/dist')
                    .set('bin',  '<root>/bin')
                    .set('lib',  '<root>/lib');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        dist : `${root}/dist`,
                        bin  : `${root}/bin`,
                        lib  : `${root}/lib`,
                    }
                );
            },
            'exceptions' : () => {
                // invalid name
                try {
                    path.set();
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // invalid name
                try {
                    path.set('');
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // invalid glob
                try {
                    path.set('path-name');
                } catch (exception) {
                    assert(exception instanceof InvalidGlobException);
                }

                // invalid glob
                try {
                    path.set('path-name', {});
                } catch (exception) {
                    assert(exception instanceof InvalidGlobException);
                }

                // invalid options
                try {
                    path.set('path-name', [], []);
                } catch (exception) {
                    assert(exception instanceof TypeException);
                }
            },
        },
    }
};
