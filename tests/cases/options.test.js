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
            // reset options
            path.setOptions(path.DEFAULTS);

            // reset paths by removing all
            path.removeAll();
        },

        '.getOptions()' : () => {
            assert.deepStrictEqual(
                path.getOptions(),
                path.DEFAULTS
            );

            assert(path.getOptions('rootName')            === path.DEFAULT_ROOT_NAME);
            assert(path.getOptions('prefix')              === path.DEFAULT_NAME_TOKEN.prefix);
            assert(path.getOptions('suffix')              === path.DEFAULT_NAME_TOKEN.suffix);
            assert(path.getOptions('appendToNonExistent') === path.DEFAULT_APPEND_TO_NON_EXISTENT);
        },

        '.setOptions()' : () => {
            // set one option
            path.setOptions({
                rootName : '/www'
            });

            assert(path.getOptions('rootName') === '/www');

            // set multiple options
            path.setOptions({
                rootName : '/home',
                prefix   : '<<',
                suffix   : '>>',
            });

            assert(path.getOptions('rootName') === '/home');
            assert(path.getOptions('prefix')   === '<<');
            assert(path.getOptions('suffix')   === '>>');
        },
    }
};
