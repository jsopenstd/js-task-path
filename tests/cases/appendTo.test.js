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

        '.appendTo()' : {
            'general' : () => {
                const root = path.getRoot();

                path.set('src', '<root>/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        src  : `${root}/src`,
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
                        src  : [
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
                },
                'set and append' : () => {
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
    }
};
