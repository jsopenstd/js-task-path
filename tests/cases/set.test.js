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
            'default' : () => {
                const root = path.getRoot();

                assert(path.set('dist', '<root>/dist') === `${root}/dist`);
                assert(path.set('bin',  '<root>/bin')  === `${root}/bin`);
                assert(path.set('lib',  '<root>/lib')  === `${root}/lib`);

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        dist : `${root}/dist`,
                        bin  : `${root}/bin`,
                        lib  : `${root}/lib`,
                    }
                );
            },
            'extended' : () => {

            },
            'edge' : () => {

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
