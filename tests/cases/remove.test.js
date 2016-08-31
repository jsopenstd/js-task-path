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

        '.remove()' : () => {
            const root = path.getRoot();

            assert(path.set('src',   '<root>/src')   === `${root}/src`);
            assert(path.set('tests', '<root>/tests') === `${root}/tests`);
            assert(path.set('doc',   '<root>/doc')   === `${root}/doc`);

            assert.deepStrictEqual(
                path.getAll(),
                {
                    src   : `${root}/src`,
                    tests : `${root}/tests`,
                    doc   : `${root}/doc`,
                }
            );

            assert(path.remove('src') === `${root}/src`);

            assert.deepStrictEqual(
                path.getAll(),
                {
                    tests : `${root}/tests`,
                    doc   : `${root}/doc`,
                }
            );

            assert(path.remove('tests') === `${root}/tests`);
            assert(path.remove('doc')   === `${root}/doc`);

            assert.deepStrictEqual(path.getAll(), {});
        },
    }
};
