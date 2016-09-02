'use strict';

const assert = require('assert'),
      vars   = require('../variables'),
      path   = require(vars.path);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            // reset options
            path.setOptions(path.DEFAULTS);

            // reset paths by removing all
            path.removeAll();
        },

        '.removeAll()' : {
            'return empty {} by default' : () => {
                // the root should not be in between the paths by default
                assert.deepStrictEqual(path.removeAll(), {});
            },

            'remove previously set paths' : () => {
                path.set('a', '1');
                path.set('b', '2');
                path.set('c', '3');

                assert.deepStrictEqual(
                    path.removeAll(),
                    {
                        a : '1',
                        b : '2',
                        c : '3',
                    }
                );

                assert.deepStrictEqual(path.removeAll(), {});
            },
        },
    }
};
