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
        '.set()' : {
            'default' : () => {

            },
            'extended' : () => {

            },
            'edge' : () => {

            },
            'exceptions' : () => {
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
            },
        },
    }
};
