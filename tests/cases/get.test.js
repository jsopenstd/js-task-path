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
