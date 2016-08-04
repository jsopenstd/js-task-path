'use strict';

var assert = require('assert'),
    vars   = require('./variables'),
    path   = require(vars.path);

var root;

module.exports = {
    'js-task-paths' : {
        'before' : function() {
            root = path.getRoot();
        },
        'beforeEach' : function() {
            path.removeAll();
        },
        'default cases' : {
            'root check' : function() {
                assert(path.getRoot() === root);
            },
            'set paths' : function() {
                assert(path.setPath('dist', '<root>/dist') === root + '/dist');
                assert(path.setPath('bin',  '<root>/bin')  === root + '/bin');
                assert(path.setPath('lib',  '<root>/lib')  === root + '/lib');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : root,
                        dist : root + '/dist',
                        bin  : root + '/bin',
                        lib  : root + '/lib'
                    }
                );
            },
            'remove paths' : function() {
                assert(path.setPath('src',   '<root>/src')   === root + '/src');
                assert(path.setPath('tests', '<root>/tests') === root + '/tests');
                assert(path.setPath('doc',   '<root>/doc')   === root + '/doc');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root  : root,
                        src   : root + '/src',
                        tests : root + '/tests',
                        doc   : root + '/doc'
                    }
                );

                assert(path.removePath('src') === root + '/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root  : root,
                        tests : root + '/tests',
                        doc   : root + '/doc'
                    }
                );

                assert(path.removePath('tests') === root + '/tests');
                assert(path.removePath('doc')   === root + '/doc');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root  : root
                    }
                );
            }
        },
        'extended cases' : {
            'appendTo paths' : function() {
                path.setPath('src', '<root>/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : root,
                        src  : root + '/src'
                    }
                );

                let newGlob = path.appendToPath('src', '<root>/src/another-path/');

                assert.deepStrictEqual(
                    newGlob,
                    [
                        root + '/src',
                        root + '/src/another-path/'
                    ]
                );

                // add a glob, that is already in the named glob path
                newGlob = path.appendToPath('src', '<root>/src');

                assert.deepStrictEqual(
                    newGlob,
                    [
                        root + '/src',
                        root + '/src/another-path/'
                    ]
                );
            },
            'removeFrom paths' : function() {
                path.setPath('src', '<root>/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : root,
                        src  : root + '/src'
                    }
                );

                let newGlob = path.appendToPath('src', '<root>/src/another-path/');

                assert.deepStrictEqual(
                    newGlob,
                    [
                        root + '/src',
                        root + '/src/another-path/'
                    ]
                );

                let removedGlob = path.removeFromPath('src', '<root>/src');

                assert.deepStrictEqual(
                    removedGlob,
                    [
                        root + '/src'
                    ]
                );

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : root,
                        src  : [
                            root + '/src/another-path/'
                        ]
                    }
                );
            }
        },
        'edge cases' : {
            'overwrite root' : function() {
                assert(path.getRoot() === root);

                assert(path.setRoot('/differentRoot') === '/differentRoot');
                assert(path.getRoot() === '/differentRoot');

                assert(path.setPath('src', '<root>/src') === '/differentRoot/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : '/differentRoot',
                        src  : '/differentRoot/src'
                    }
                );

                assert(path.setRoot(root) === root);
                assert(path.getRoot() === root);

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : root,
                        src  : '/differentRoot/src'
                    }
                );
            },
            'remove all paths' : function() {
                path.setPath('A', 'A');
                path.setPath('B', 'B');
                path.setPath('C', 'C');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : root,
                        A    : 'A',
                        B    : 'B',
                        C    : 'C'
                    }
                );

                let removedGlobs = path.removeAll();

                assert.deepStrictEqual(
                    removedGlobs,
                    {
                        A    : 'A',
                        B    : 'B',
                        C    : 'C'
                    }
                );

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : root
                    }
                );
            }
        }
    }
};
