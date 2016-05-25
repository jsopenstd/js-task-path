"use strict";

const use    = require('rekuire'),

      assert = require('assert'),

      p     = use("tasks/gulp/helpers/paths"),
      Paths = use(p.getPath("test-path"));

var PATH = require("../src/paths");

module.exports = {
    "js-task-paths" : {
        "beforeEach" : function() {
            Paths.removeAll();
        },
        "default cases" : {
            "root check" : function() {
                assert(Paths.getRoot() === "/vagrant");
            },
            "set paths" : function() {
                assert(Paths.setPath("dist", "<root>/dist") === "/vagrant/dist");
                assert(Paths.setPath("bin",  "<root>/bin")  === "/vagrant/bin");
                assert(Paths.setPath("lib",  "<root>/lib")  === "/vagrant/lib");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : '/vagrant',
                        dist : '/vagrant/dist',
                        bin  : '/vagrant/bin',
                        lib  : '/vagrant/lib'
                    }
                );
            },
            "remove paths" : function() {
                assert(Paths.setPath("src",   "<root>/src")   === "/vagrant/src");
                assert(Paths.setPath("tests", "<root>/tests") === "/vagrant/tests");
                assert(Paths.setPath("doc",   "<root>/doc")   === "/vagrant/doc");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root  : '/vagrant',
                        src   : '/vagrant/src',
                        tests : '/vagrant/tests',
                        doc   : '/vagrant/doc'
                    }
                );

                assert(Paths.removePath("src") === "/vagrant/src");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root  : '/vagrant',
                        tests : '/vagrant/tests',
                        doc   : '/vagrant/doc'
                    }
                );

                assert(Paths.removePath("tests") === "/vagrant/tests");
                assert(Paths.removePath("doc")   === "/vagrant/doc");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root  : '/vagrant'
                    }
                );
            }
        },
        "extended cases" : {
            "appendTo paths" : function() {
                Paths.setPath("src", "<root>/src");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : '/vagrant',
                        src  : '/vagrant/src'
                    }
                );

                let newGlob = Paths.appendToPath("src", "<root>/src/another-path/");

                assert.deepStrictEqual(
                    newGlob,
                    [
                        "/vagrant/src",
                        "/vagrant/src/another-path/"
                    ]
                );

                // add a glob, that is already in the named glob path
                newGlob = Paths.appendToPath("src", "<root>/src");

                assert.deepStrictEqual(
                    newGlob,
                    [
                        "/vagrant/src",
                        "/vagrant/src/another-path/"
                    ]
                );
            },
            "removeFrom paths" : function() {
                Paths.setPath("src", "<root>/src");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : '/vagrant',
                        src  : '/vagrant/src'
                    }
                );

                let newGlob = Paths.appendToPath("src", "<root>/src/another-path/");

                assert.deepStrictEqual(
                    newGlob,
                    [
                        "/vagrant/src",
                        "/vagrant/src/another-path/"
                    ]
                );

                let removedGlob = Paths.removeFromPath("src", "<root>/src");

                assert.deepStrictEqual(
                    removedGlob,
                    [
                        "/vagrant/src"
                    ]
                );

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : '/vagrant',
                        src  : [
                            "/vagrant/src/another-path/"
                        ]
                    }
                );
            }
        },
        "edge cases" : {
            "overwrite root" : function() {
                assert(Paths.getRoot() === "/vagrant");

                assert(Paths.setRoot("/differentRoot") === "/differentRoot");
                assert(Paths.getRoot() === "/differentRoot");

                assert(Paths.setPath("src", "<root>/src") === "/differentRoot/src");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : "/differentRoot",
                        src  : "/differentRoot/src"
                    }
                );

                assert(Paths.setRoot("/vagrant") === "/vagrant");
                assert(Paths.getRoot() === "/vagrant");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : "/vagrant",
                        src  : "/differentRoot/src"
                    }
                );
            },
            "remove all paths" : function() {
                Paths.setPath("A", "A");
                Paths.setPath("B", "B");
                Paths.setPath("C", "C");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : '/vagrant',
                        A    : 'A',
                        B    : 'B',
                        C    : 'C'
                    }
                );

                let removedGlobs = Paths.removeAll();

                assert.deepStrictEqual(
                    removedGlobs,
                    {
                        A    : 'A',
                        B    : 'B',
                        C    : 'C'
                    }
                );

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : '/vagrant'
                    }
                );
            }
        }
    }
};
