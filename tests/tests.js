'use strict';

const assert = require('assert'),
      vars   = require('./variables'),
      path   = require(vars.path);

var root;

module.exports = {
    'js-task-paths' : {
        'before' : () => {
            root = path.getRoot();
        },
        'beforeEach' : () => {
            path.removeAll();
        },
        'default cases' : {
            'root check' : () => {
                assert(path.getRoot() === root);
            },
            'set paths' : () => {
                assert(path.set('dist', '<root>/dist') === root + '/dist');
                assert(path.set('bin',  '<root>/bin')  === root + '/bin');
                assert(path.set('lib',  '<root>/lib')  === root + '/lib');

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
            'remove paths' : () => {
                assert(path.set('src',   '<root>/src')   === root + '/src');
                assert(path.set('tests', '<root>/tests') === root + '/tests');
                assert(path.set('doc',   '<root>/doc')   === root + '/doc');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root  : root,
                        src   : root + '/src',
                        tests : root + '/tests',
                        doc   : root + '/doc'
                    }
                );

                assert(path.remove('src') === root + '/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root  : root,
                        tests : root + '/tests',
                        doc   : root + '/doc'
                    }
                );

                assert(path.remove('tests') === root + '/tests');
                assert(path.remove('doc')   === root + '/doc');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root  : root
                    }
                );
            }
        },
        'extended cases' : {
            'appendTo paths' : () => {
                path.set('src', '<root>/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : root,
                        src  : root + '/src'
                    }
                );

                let newGlob = path.appendTo('src', '<root>/src/another-path/');

                assert.deepStrictEqual(
                    newGlob,
                    [
                        root + '/src',
                        root + '/src/another-path/'
                    ]
                );

                // add a glob, that is already in the named glob path
                newGlob = path.appendTo('src', '<root>/src');

                assert.deepStrictEqual(
                    newGlob,
                    [
                        root + '/src',
                        root + '/src/another-path/'
                    ]
                );
            },
            'removeFrom paths' : () => {
                path.set('src', '<root>/src');

                assert.deepStrictEqual(
                    path.getAll(),
                    {
                        root : root,
                        src  : root + '/src'
                    }
                );

                let newGlob = path.appendTo('src', '<root>/src/another-path/');

                assert.deepStrictEqual(
                    newGlob,
                    [
                        root + '/src',
                        root + '/src/another-path/'
                    ]
                );

                let removedGlob = path.removeFrom('src', '<root>/src');

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
            },

            'exceptions' : () => {
                const InvalidGlobException     = path.exception.InvalidGlobException,
                      InvalidPathNameException = path.exception.InvalidPathNameException,
                      PathNotFoundException    = path.exception.PathNotFoundException,
                      TypeException            = path.exception.TypeException;

                // without parameter
                try {
                    path.get();
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // empty string
                try {
                    path.get('');
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // invalid name
                try {
                    path.set();
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // invalid name
                try {
                    path.set('');
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // invalid glob
                try {
                    path.set('path-name');
                } catch (exception) {
                    assert(exception instanceof InvalidGlobException);
                }

                // invalid glob
                try {
                    path.set('path-name', {});
                } catch (exception) {
                    assert(exception instanceof InvalidGlobException);
                }

                // invalid options
                try {
                    path.set('path-name', [], []);
                } catch (exception) {
                    assert(exception instanceof TypeException);
                }

                // invalid name
                try {
                    path.get();
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                // invalid name
                try {
                    path.get('');
                } catch (exception) {
                    assert(exception instanceof InvalidPathNameException);
                }

                try {
                    path.get('q3xg5487kdd7');
                } catch (exception) {
                    assert(exception instanceof PathNotFoundException);
                }
            }
        },
        'edge cases' : {
            'overwrite root' : () => {
                assert(path.getRoot() === root);

                assert(path.setRoot('/differentRoot') === '/differentRoot');
                assert(path.getRoot() === '/differentRoot');

                assert(path.set('src', '<root>/src') === '/differentRoot/src');

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
            'remove all paths' : () => {
                path.set('A', 'A');
                path.set('B', 'B');
                path.set('C', 'C');

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
