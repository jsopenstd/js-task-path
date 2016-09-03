'use strict';

const assert = require('assert'),
      vars   = require('../variables'),

      path = require(vars.path),

      PathNotFoundException = require(vars.exception.PathNotFoundException);

module.exports = {
    'js-task-paths' : {
        'beforeEach' : () => {
            path.reset();
        },

        '.appendTo()' : {
            'general' : () => {
                const root = path.getRoot();

                path.set('src', '<root>/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        src : `${root}/src`,
                    }
                );

                path.appendTo('src', '<root>/src/another-path/');

                assert.deepStrictEqual(
                    path.get('src'),
                    [
                        `${root}/src`,
                        `${root}/src/another-path/`,
                    ]
                );

                path.removeFrom('src', '<root>/src');

                assert.deepStrictEqual(
                    path.get('src'),
                    [
                        `${root}/src/another-path/`,
                    ]
                );

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        src : [
                            `${root}/src/another-path/`,
                        ],
                    }
                );
            },

            'chaining' : {
                'append only' : () => {
                    const root = path.getRoot();

                    path.set('src', '<root>/src');

                    path
                        .appendTo('src', '<root>/src/one/')
                        .appendTo('src', '<root>/src/two/')
                        .appendTo('src', '<root>/src/three/');

                    assert.deepStrictEqual(
                        path.get('src'),
                        [
                            `${root}/src`,
                            `${root}/src/one/`,
                            `${root}/src/two/`,
                            `${root}/src/three/`,
                        ]
                    );

                    assert.deepStrictEqual(
                        path.getAll(),
                        {
                            src : [
                                `${root}/src`,
                                `${root}/src/one/`,
                                `${root}/src/two/`,
                                `${root}/src/three/`,
                            ]
                        }
                    );

                    // append an array to a path
                    path.set('dist', '<root>/dist')
                        .appendTo(
                            'dist',
                            [
                                '<root>/doc',
                                '<root>/license',
                            ]
                        );

                    assert.deepStrictEqual(
                        path.get('dist'),
                        [
                            `${root}/dist`,
                            `${root}/doc`,
                            `${root}/license`,
                        ]
                    );

                    // append an already existing glob to the globs
                    // in this case since the glob already exists, nothing will happen.
                    path.appendTo('src', '<root>/src/one/');

                    assert.deepStrictEqual(
                        path.get('src'),
                        [
                            `${root}/src`,
                            `${root}/src/one/`,
                            `${root}/src/two/`,
                            `${root}/src/three/`,
                        ]
                    );
                },

                'append to non-existing' : () => {
                    const root = path.getRoot();

                    path.appendTo('src', '<root>/src');

                    assert(path.get('src') === `${root}/src`);

                    path.appendTo('dist', '<root>/dist/one/')
                        .appendTo('dist', '<root>/dist/two/')
                        .appendTo('dist', '<root>/dist/three/');

                    assert.deepStrictEqual(
                        path.get('dist'),
                        [
                            `${root}/dist/one/`,
                            `${root}/dist/two/`,
                            `${root}/dist/three/`,
                        ]
                    );
                },

                'set and append to existing' : () => {
                    const root = path.getRoot();

                    path
                        .set('src', '<root>/src')
                        .appendTo('src', '<root>/src/one/')
                        .appendTo('src', '<root>/src/two/')
                        .appendTo('src', '<root>/src/three/');

                    assert.deepStrictEqual(
                        path.get('src'),
                        [
                            `${root}/src`,
                            `${root}/src/one/`,
                            `${root}/src/two/`,
                            `${root}/src/three/`,
                        ]
                    );

                    assert.deepStrictEqual(
                        path.getAll(),
                        {
                            src : [
                                `${root}/src`,
                                `${root}/src/one/`,
                                `${root}/src/two/`,
                                `${root}/src/three/`,
                            ]
                        }
                    );
                },
            },
        },

        'exceptions' : () => {
            path.setOptions({
                append : path.THROW_IF_PATH_NOT_EXISTS
            });

            try {
                path.appendTo('src', '<root>/src');
            } catch (exception) {
                assert(exception instanceof PathNotFoundException);
            }
        },
    }
};
