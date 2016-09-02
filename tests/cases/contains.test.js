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

        '.contains()' : {
            'single path' : () => {
                path.set('src', '<root>/src');

                // existing
                assert(path.contains('src', '<root>/src')  === true);
                assert(path.contains('src', '<root>/dist') === false);

                // non-existing
                assert(path.contains('dist', '<root>/dist') === false);
                assert(path.contains('lib',  '<root>/dist') === false);
            },

            'multiple paths' : () => {
                path.set(
                    'src',
                    [
                        '<root>/src',
                        '<root>/dist',
                    ]
                );

                assert(path.contains('src', '<root>/src')  === true);
                assert(path.contains('src', '<root>/dist') === true);
            },

            'edge cases' : {
                'contains an array of globs' : () => {
                    path.set(
                        'src',
                        [
                            '<root>/src',
                            '<root>/doc',
                            '<root>/assets',
                        ]
                    );

                    assert(
                        path.contains(
                            'src',
                            [
                                '<root>/doc',
                                '<root>/assets',
                            ]
                        )

                        === true
                    );

                    assert(
                        path.contains(
                            'src',
                            [
                                '<root>/doc',
                                '<root>/lib',
                            ]
                        )

                        === false
                    );
                },
            },
        },
    }
};
