'use strict';

const assert = require('assert'),
      vars   = require('../variables'),

      path = require(vars.path);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            path.reset();
        },

        '.removeFrom()' : {
            'existent' : () => {
                const root = path.getRoot();

                path.set('src', '<root>/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        src  : `${root}/src`,
                    }
                );

                path.appendTo('src', '<root>/src/another-path');

                assert.deepStrictEqual(
                    path.get('src'),
                    [
                        `${root}/src`,
                        `${root}/src/another-path`,
                    ]
                );

                path.removeFrom('src', '<root>/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        src  : [
                            `${root}/src/another-path`,
                        ],
                    }
                );

                // again, but this time the removable glob is in an array
                path.set('src', '<root>/src');

                path.removeFrom(
                    'src',
                    [
                        '<root>/src',
                    ]
                );

                assert(path.has('src') === false);
            },

            'edge cases' : {
                'remove multiple globs at the same time' : () => {
                    const root = path.getRoot();

                    // remove none from it
                    path.set(
                        'src',
                        [
                            '<root>/src',
                            '<root>/assets',
                            '<root>/doc',
                        ]
                    );

                    path.removeFrom(
                        'src',
                        [
                            '<root>/lib',
                        ]
                    );

                    assert(
                        path.get('src'),
                        [
                            `${root}/src`,
                            `${root}/assets`,
                            `${root}/doc`,
                        ]
                    );

                    // remove a partial from it
                    path.set(
                        'src',
                        [
                            '<root>/src',
                            '<root>/assets',
                            '<root>/doc',
                        ]
                    );

                    path.removeFrom(
                        'src',
                        [
                            '<root>/assets',
                            '<root>/doc',
                        ]
                    );

                    assert(
                        path.get('src'),
                        [
                            `${root}/src`,
                        ]
                    );

                    // remove completely
                    path.set(
                        'src',
                        [
                            '<root>/src',
                            '<root>/assets',
                            '<root>/doc',
                        ]
                    );

                    path.removeFrom(
                        'src',
                        [
                            '<root>/src',
                            '<root>/assets',
                            '<root>/doc',
                        ]
                    );

                    assert(path.has('src') === false);
                },

                'delete path, when last glob removed' : () => {
                    path.set('src', '<root>/src');

                    path.removeFrom('src', '<root>/src');

                    assert.deepStrictEqual(path.getAll(), {});
                },
            },

            'non-existent' : () => {
                const root = path.getRoot();

                // non-existent, never set before
                path.removeFrom('src', '<root>/src');

                assert.deepStrictEqual(path.getAll(), {});

                // path exists, but not the glob
                path.set('src', '<root>/src');

                path.removeFrom('src', '<root>/doc');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        src : `${root}/src`,
                    }
                );
            },
        },
    }
};
