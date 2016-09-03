'use strict';

const assert = require('assert'),
      vars   = require('../variables'),

      path = require(vars.path);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            path.reset();
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
