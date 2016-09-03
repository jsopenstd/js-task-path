'use strict';

const assert = require('assert'),
      vars   = require('../variables'),
      path   = require(vars.path);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            path.reset();
        },

        '.getAll()' : {
            'empty by default' : () => {
                // the root should not be in between the paths by default
                assert.deepStrictEqual(path.getAll(), {});
            },

            'return previously set paths' : () => {

                // paths with single globs
                path.set('a', '1');
                path.set('b', '2');
                path.set('c', '3');

                // path with multiple glob
                path.set(
                    'd',
                    [
                        '4',
                        '5',
                    ]
                );

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        a : '1',
                        b : '2',
                        c : '3',
                        d : [
                            '4',
                            '5',
                        ],
                    }
                );
            },
        },
    }
};
