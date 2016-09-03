'use strict';

const assert = require('assert'),
      vars   = require('../variables'),
      path   = require(vars.path);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            path.reset();
        },

        '.removeAll()' : {
            'return empty {} by default' : () => {
                // the root should not be in between the paths by default
                path.removeAll();

                assert.deepStrictEqual(path.getAll(), {});
            },

            'remove previously set paths' : () => {
                path.set('a', '1');
                path.set('b', '2');
                path.set('c', '3');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        a : '1',
                        b : '2',
                        c : '3',
                    }
                );

                path.removeAll();

                assert.deepStrictEqual(path.getAll(), {});
            },
        },
    }
};
