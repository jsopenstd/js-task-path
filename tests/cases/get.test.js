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

        '.get()' : {
            'general' : () => {
                const root = path.getRoot();

                // check the default 'root' existence
                assert(path.get('root') === root);

                // paths with single globs
                path.set('dist', '<root>/dist');
                path.set('bin',  '<root>/bin');
                path.set('lib',  '<root>/lib');

                // path with multiple globs
                path.set(
                    'src',
                    [
                        '<root>/src/one',
                        '<root>/src/two',
                    ]
                );

                assert(path.get('dist') === `${root}/dist`);
                assert(path.get('bin')  === `${root}/bin`);
                assert(path.get('lib')  === `${root}/lib`);

                assert.deepStrictEqual(
                    path.get('src'),
                    [
                        `${root}/src/one`,
                        `${root}/src/two`,
                    ]
                );
            },
            'auto resolve' : () => {
                const root = path.getRoot();

                // by default 'root' can be used
                assert(path.get('<root>/package.json') === `${root}/package.json`);

                path.set('src',        '<root>/src');
                path.set('src/images', '<src>/images'); // could be written also like '<root>/src/images'
                path.set('src/watch',  '<src>/**/*.*'); // could be written also like '<root>/src/**/*.*'

                // no auto-resolve
                assert(path.get('src') + '/module.js' === `${root}/src/module.js`);

                // auto-resolve
                assert(path.get('<src>/module.js')    === `${root}/src/module.js`);
                assert(path.get('<src/images>/*.jpg') === `${root}/src/images/*.jpg`);
                assert(path.get('<src/watch>')        === `${root}/src/**/*.*`);
            },
            'getter shorthand' : () => {
                const root = path.getRoot();

                // check the default 'root' existence
                assert(path('root')   === root);
                assert(path('<root>') === root);

                // paths with single globs
                path('dist', '<root>/dist');
                path('bin',  '<root>/bin');
                path('lib',  '<root>/lib');

                // path with multiple globs
                path(
                    'src',
                    [
                        '<root>/src/one',
                        '<root>/src/two',
                    ]
                );

                // general
                assert(path('dist') === `${root}/dist`);
                assert(path('bin')  === `${root}/bin`);
                assert(path('lib')  === `${root}/lib`);

                // auto-resolve
                assert(path('<dist>') === `${root}/dist`);
                assert(path('<bin>')  === `${root}/bin`);
                assert(path('<lib>')  === `${root}/lib`);

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        src  : [
                            `${root}/src/one`,
                            `${root}/src/two`,
                        ],
                        dist : `${root}/dist`,
                        bin  : `${root}/bin`,
                        lib  : `${root}/lib`,
                    }
                );
            },
            'exceptions' : () => {
                // without parameter
                try {
                    path.get();
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // empty string
                try {
                    path.get('');
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // invalid name
                try {
                    path.get();
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // invalid name
                try {
                    path.get('');
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                try {
                    path.get('q3xg5487kdd7');
                } catch (exception) {
                    assert(exception instanceof PathNotFoundException);
                }
            },
        },
    }
};
