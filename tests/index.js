"use strict";

const use    = require("rekuire"),

      assert = require("assert"),

      path  = use("script/gulp/helpers/paths"),
      Paths = use(path.getPath("test-path"));

var PATH = require("../src/paths");

var root;

module.exports = {
    "js-task-paths" : {
        "before" : function() {
            root = Paths.getRoot();
        },
        "beforeEach" : function() {
            Paths.removeAll();
        },
        "default cases" : {
            "root check" : function() {
                assert(Paths.getRoot() === root);
            },
            "set paths" : function() {
                assert(Paths.setPath("dist", "<root>/dist") === root + "/dist");
                assert(Paths.setPath("bin",  "<root>/bin")  === root + "/bin");
                assert(Paths.setPath("lib",  "<root>/lib")  === root + "/lib");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : root,
                        dist : root + "/dist",
                        bin  : root + "/bin",
                        lib  : root + "/lib"
                    }
                );
            },
            "remove paths" : function() {
                assert(Paths.setPath("src",   "<root>/src")   === root + "/src");
                assert(Paths.setPath("tests", "<root>/tests") === root + "/tests");
                assert(Paths.setPath("doc",   "<root>/doc")   === root + "/doc");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root  : root,
                        src   : root + "/src",
                        tests : root + "/tests",
                        doc   : root + "/doc"
                    }
                );

                assert(Paths.removePath("src") === root + "/src");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root  : root,
                        tests : root + "/tests",
                        doc   : root + "/doc"
                    }
                );

                assert(Paths.removePath("tests") === root + "/tests");
                assert(Paths.removePath("doc")   === root + "/doc");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root  : root
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
                        root : root,
                        src  : root + "/src"
                    }
                );

                let newGlob = Paths.appendToPath("src", "<root>/src/another-path/");

                assert.deepStrictEqual(
                    newGlob,
                    [
                        root + "/src",
                        root + "/src/another-path/"
                    ]
                );

                // add a glob, that is already in the named glob path
                newGlob = Paths.appendToPath("src", "<root>/src");

                assert.deepStrictEqual(
                    newGlob,
                    [
                        root + "/src",
                        root + "/src/another-path/"
                    ]
                );
            },
            "removeFrom paths" : function() {
                Paths.setPath("src", "<root>/src");

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : root,
                        src  : root + "/src"
                    }
                );

                let newGlob = Paths.appendToPath("src", "<root>/src/another-path/");

                assert.deepStrictEqual(
                    newGlob,
                    [
                        root + "/src",
                        root + "/src/another-path/"
                    ]
                );

                let removedGlob = Paths.removeFromPath("src", "<root>/src");

                assert.deepStrictEqual(
                    removedGlob,
                    [
                        root + "/src"
                    ]
                );

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : root,
                        src  : [
                            root + "/src/another-path/"
                        ]
                    }
                );
            }
        },
        "edge cases" : {
            "overwrite root" : function() {
                assert(Paths.getRoot() === root);

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

                assert(Paths.setRoot(root) === root);
                assert(Paths.getRoot() === root);

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : root,
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
                        root : root,
                        A    : "A",
                        B    : "B",
                        C    : "C"
                    }
                );

                let removedGlobs = Paths.removeAll();

                assert.deepStrictEqual(
                    removedGlobs,
                    {
                        A    : "A",
                        B    : "B",
                        C    : "C"
                    }
                );

                assert.deepStrictEqual(
                    Paths.getAll(),
                    {
                        root : root
                    }
                );
            }
        }
    }
};
