'use strict';

const assert = require('assert'),
      vars   = require('../variables'),

      path = require(vars.path);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            // reset options
            path.setOptions(path.DEFAULTS);

            // reset paths by removing all
            path.removeAll();
        },

        '.remove()' : () => {
            const root = path.getRoot();

            path.set('src',   '<root>/src');
            path.set('tests', '<root>/tests');
            path.set('doc',   '<root>/doc');

            assert.deepStrictEqual(
                path.getAll(),
                {
                    src   : `${root}/src`,
                    tests : `${root}/tests`,
                    doc   : `${root}/doc`,
                }
            );

            path.remove('src');

            assert.deepStrictEqual(
                path.getAll(),
                {
                    tests : `${root}/tests`,
                    doc   : `${root}/doc`,
                }
            );

            path.remove('tests');
            path.remove('doc');

            // remove already removed
            path.remove('doc');

            // remove never-existed
            path.remove('dist');

            assert.deepStrictEqual(path.getAll(), {});
        },
    }
};
