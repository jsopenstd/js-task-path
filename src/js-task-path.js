'use strict';

/*
 |----------------------------------------------------------------------------------------------------------------------
 | A helper class to manage task-, build- and deployment-related paths more easily throughout the whole project.
 |----------------------------------------------------------------------------------------------------------------------
 */

/**
 * More information on [JavaScript Open Standards]{@link https://github.com/jsopenstd/jsopenstd}.
 *
 * @namespace js.task
 * @version 1.0.3
 *
 * @author Richard King <richrdkng@gmail.com> [GitHub]{@link https://github.com/richrdkng}
 * @license [MIT]{@link https://github.com/jsopenstd/js-partial-foreach/blob/master/license.md}
 */

/*
 |----------------------------------------------------------------------------------------------------------------------
 | Essential modules
 |----------------------------------------------------------------------------------------------------------------------
 */
const nodePath           = require('path'),
      appRootPath        = require('app-root-path'),
      escapeStringRegexp = require('escape-string-regexp'),
      extend             = require('extend'),
      foreach            = require('js-partial-foreach'),
      isPresent          = require('js-partial-is-present'),
      isString           = require('js-partial-is-string'),
      isEmptyString      = require('js-partial-is-empty-string'),
      isArray            = require('js-partial-is-array'),
      isObject           = require('js-partial-is-object'),
      arrayMerge         = require('js-partial-array-merge');
/*
 |----------------------------------------------------------------------------------------------------------------------
 | Exceptions
 |----------------------------------------------------------------------------------------------------------------------
 */
const InvalidGlobException     = require('./exception/InvalidGlobException'),
      InvalidPathNameException = require('./exception/InvalidPathNameException'),
      PathNotFoundException    = require('./exception/PathNotFoundException'),
      TypeException            = require('./exception/TypeException');

let self;

/**
 * @class Path
 * @memberOf js.task
 */
const Path = function Path() {
    // create a placeholder function as a base function for further extension

    /**
     * A getter/setter shorthand for path.
     *
     * @param {string|Object}   name   - The name of the glob.
     *                                   If it is an object, multiple path globs can be set at once.
     * @param {string|string[]} [glob] - The glob of path.
     *
     * @returns {string|string[]|Path} If used as a getter, returns glob of path.
     *                                 If used a setter, returns Path to provide chainability.
     */
    const instancePlaceholder = function PathInstance(name, glob) {

        // if glob is present, behave as a setter
        if (isPresent(glob)) {
            return PathInstance.set(name, glob);
        }

        // if name is an array, behave as setter for multiple paths
        if (isObject(name)) {
            foreach(
                name,
                (pathName, pathGlob) => {
                    PathInstance.set(pathName, pathGlob);
                }
            );

            return PathInstance;
        }

        // behave as a getter
        return PathInstance.get(name);
    };

    /*
     |------------------------------------------------------------------------------------------------------------------
     | Extension and Instantiations
     |------------------------------------------------------------------------------------------------------------------
     */

    // extend the placeholder function with Path's prototype
    // as the placeholder function will behave as an instance of Path and '.this' will be properly usable,
    // but at the same time it will be still just a function and it can be just simply called
    // providing a shorthand getter/setter functionality for the path globs (e.g.: path('<root>'))
    extend(
        instancePlaceholder,
        Path.prototype,
        self
    );

    /**
     * The storage object for the named glob paths.
     *
     * @private {Object}
     * @default {}
     */
    instancePlaceholder._paths = {};

    // set the default values of options
    instancePlaceholder.setOptions(self.DEFAULTS);

    // set the default value for root
    instancePlaceholder.setRoot(appRootPath.toString());

    // return the placeholder function with all the necessary functionality from Path's prototype
    // and with initial, instantiated values
    return instancePlaceholder;
};

Path.prototype = {
    constructor : Path,

    /**
     * Gets the glob path by the given name.
     *
     * @function get
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     *                        If the name contains an existing path name (e.g.: path.get('<root>/package.json')),
     *                        then it will be automatically resolved.
     *
     * @returns {string|Array} The glob path.
     *
     * @example
     * // auto-resolve a path, so
     * // instead of this below:
     * path.get('root') + '/package.json';
     *
     * // it can be used like this:
     * path.get('<root>/package.json');
     */
    get(name) {
        // in case of root
        if (name === this._options.rootName) {
            return this.getRoot();
        }

        // in case of auto-resolvable path names
        if (this._containsToken(name)) {
            return this._resolveNameTokens(name);
        }

        this._checkPathExists(name);

        return this._paths[name];
    },

    /**
     * Sets the given glob path by the given name.
     *
     * If the glob path by the same name already exists, it will be overridden.
     *
     * @function set
     * @memberOf js.task.Path
     *
     * @param {string}       name                    - The name of the glob path.
     * @param {string|Array} glob                    - The glob path. Can be an array of globs.
     * @param {Object}       [options=Path.DEFAULTS] - The options that used to filter the glob path.
     *                                                 see: {@link js.task.Path.DEFAULTS}
     *
     * @returns {Path} The path instance to provide chainability.
     */
    set(name, glob, options) {
        this._setGlobPath(this._paths, name, glob, options);

        return this;
    },

    /**
     * Returns whether a glob path by the given name was stored previously.
     *
     * @function has
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     *
     * @returns {boolean} Whether has a path under this name.
     */
    has(name) {
        this._checkName(name);

        return name in this._paths;
    },

    /**
     * Returns whether a previously stored glob path by the given name contains the given glob path.
     *
     * If the previously stored glob path is the same (if it is a string) as -
     * or contains (if it is an array of glob paths) - the given glob path, it will return true.
     *
     * @function contains
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     * @param {string} glob - The glob path.

     * @returns {boolean} Whether the path with a name contains the glob.
     */
    contains(name, glob) {
        this._checkName(name);
        this._checkGlob(glob);

        let filteredGlob,
            storedGlob;

        if (this.has(name)) {
            filteredGlob = this._filterGlob(glob);
            storedGlob   = this.get(name);

            if (isArray(storedGlob)) {
                let contains = false;

                storedGlob.forEach((entry) => {
                    if (filteredGlob === entry) {
                        contains = true;
                    }
                });

                return contains;

            }

            return filteredGlob === storedGlob;
        }

        return false;
    },

    /**
     * Removes the glob path by the given name from the stored glob paths.
     *
     * @function remove
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     *
     * @returns {void}
     */
    remove(name) {
        this._checkName(name);

        if (this.has(name)) {
            delete this._paths[name];
        }
    },

    /**
     * Appends the given glob path to the given name.
     *
     * If there is no stored glob path under the given name,
     * it will be added anyway, as just as it was added via set(...).
     *
     * @function appendTo
     * @memberOf js.task.Path
     *
     * @param {string}       name                     - The name of the glob path.
     * @param {string|Array} glob                     - The glob path. Can be an array of globs.
     * @param {Object}       [options=Path.DEFAULTS] - The options that used to filter the glob path.
     *                                                  see: {@link js.task.Path.DEFAULTS}
     *
     * @returns {Path} The path instance to provide chainability.
     */
    appendTo(name, glob, options) {
        this._checkName(name);
        this._checkGlob(glob);
        this._checkOptions(options);

        let filteredGlob;

        if ( ! this.has(name)) {
            switch (this._options.append) {
                case self.CREATE_IF_PATH_NOT_EXISTS:
                    this.set(name, glob, options);
                    break;

                case self.THROW_IF_PATH_NOT_EXISTS:
                    throw new PathNotFoundException(name, glob);

                // skip default case, it's not needed
            }

        } else {
            // only append to the given name, if the stored glob isn't equal to/doesn't contain the given glob
            if ( ! this.contains(name, glob)) {
                let storedGlob = this.get(name);

                // if the stored glob isn't an array, convert it
                if ( ! isArray(storedGlob) ) {
                    storedGlob = [storedGlob];
                }

                filteredGlob = this._processGlob(glob, options);

                // if the processed glob isn't an array, convert it
                if ( ! isArray(filteredGlob)) {
                    filteredGlob = [filteredGlob];
                }

                filteredGlob = arrayMerge(storedGlob, filteredGlob);

                this._paths[name] = filteredGlob;
            }
        }

        return this;
    },

    /**
     * Removes the given glob path by the given name.
     *
     * After the successful removal of the given glob path,
     * if the given name will be empty (as the last glob path was removed),
     * it will be removed from the stored named glob paths.
     *
     * @function removeFrom
     * @memberOf js.task.Path
     *
     * @param {string}       name - The name of the glob path.
     * @param {string|Array} glob - The glob path. Can be an array of globs.
     *
     * @returns {void}
     */
    removeFrom(name, glob) {
        this._checkName(name);
        this._checkGlob(glob);

        if (this.has(name) && this.contains(name, glob)) {
            let processedGlob = this._processGlob(glob),
                storedGlob    = this.get(name);

            if (isString(processedGlob) && isString(storedGlob)) {
                if (processedGlob === storedGlob) {
                    this.remove(name);
                }

            } else {
                if ( ! isArray(processedGlob)) {
                    processedGlob = [processedGlob];
                }

                if ( ! isArray(storedGlob)) {
                    storedGlob = [storedGlob];
                }

                processedGlob.forEach((processedGlobEntry) => {
                    const index = storedGlob.indexOf(processedGlobEntry);

                    if (index > -1) {
                        storedGlob.splice(index, 1);
                    }
                });

                if (storedGlob.length === 0) {
                    this.remove(name);
                }
            }
        }
    },

    /**
     * Returns all of the stored named glob paths.
     *
     * The returned object will be a deep copy of the original object,
     * modifying the returned object will not change the original object.
     *
     * @function getAll
     * @memberOf js.task.Path
     *
     * @returns {Object} The object containing all of the named glob paths.
     */
    getAll() {
        return extend(true, {}, this._paths);
    },

    /**
     * Removes all the stored named glob paths.
     *
     * @function removeAll
     * @memberOf js.task.Path
     *
     * @returns {Object} Returns the removed named glob paths.
     *                   For example: { `src` : `/root/src` }
     */
    removeAll() {
        const removedGlobs = this.getAll();

        this._paths = {};

        return removedGlobs;
    },

    /**
     * Returns the options of path.
     *
     * @function getOptions
     * @memberOf js.task.Path
     *
     * @param {string} [specificOption] - If specified, the specific option with that name will be returned.
     *
     * @returns {Object|*} The storage object, that holds the values of the options.
     *                     If a specific option was specified, return that specific option.
     *
     */
    getOptions(specificOption) {
        const clonedOptions = extend(true, {}, this._options);

        if (isString(specificOption) && ! isEmptyString(specificOption)) {
            return clonedOptions[specificOption];
        }

        return clonedOptions;
    },

    /**
     * Sets the options for paths.
     *
     * @function setOptions
     * @memberOf js.task.Path
     *
     * @param {Object} options - The storage object, which holds the values of the options to change.
     *
     * @returns {void}
     */
    setOptions(options) {
        this._checkOptions(options);

        /**
         * The storage object for options
         *
         * @private {Object}
         * @default {}
         */
        this._options = this._options || {};

        extend(this._options, options);

        // if tokens were changed, regenerate the RegExp patterns;
        if (options.tokens) {
            /**
             * The RegExp patterns for matching name tokens.
             *
             * @private {RegExp[]}
             */
            this._tokens = [];

            let prefix,
                suffix;

            foreach(
                options.tokens,
                (index, token) => {
                    token = escapeStringRegexp(token);

                    if (index % 2 === 0) {
                        prefix = token;
                    } else {
                        suffix = token;
                    }

                    // construct a new RegExp pattern from the actual prefix and suffix,
                    // then prepare them for the next token iteration by resetting them (prefix = suffix = null)
                    if (prefix && suffix) {
                        this._tokens.unshift(new RegExp(`\\s*${prefix}([\\s\\-\\\\\\/.*\\w]+)${suffix}\\s*`, 'i'));
                        prefix = suffix = null;
                    }
                }
            );
        }

        // sort RegExp patterns to check longer tokens first and shortest last to ensure proper token resolution
        this._tokens = this._tokens.sort().reverse();
    },

    /**
     * Returns the root glob path.
     *
     * The root glob path is determined at the instantiation of the Path class.
     * Be cautious regarding the value of this root glob path, after the original root glob path is changed.
     *
     * @function getRoot
     * @memberOf js.task.Path
     *
     * @returns {string} The root glob path.
     */
    getRoot() {
        return this[`_${this._options.rootName}`];
    },

    /**
     * Sets the root glob path by the given glob path.
     *
     * As the root glob path is determined at the instantiation of the Path class,
     * be cautious, when changing the root glob path to avoid unwanted errors.
     *
     * @function setRoot
     * @memberOf js.task.Path
     *
     * @param {string} glob - The root glob path.
     *
     * @returns {void}
     */
    setRoot(glob) {
        this._setGlobPath(this, `_${this._options.rootName}`, glob);
    },

    /**
     * Check whether the name is valid.
     *
     * @private
     * @function _checkName
     *
     * @param {string} name - The name of a path entry.
     *
     * @returns {void}
     */
    _checkName(name) {
        if ( ! isString(name) || isEmptyString(name)) {
            throw new InvalidPathNameException(name);
        }
    },

    /**
     * Check whether the glob is valid.
     *
     * @private
     * @function _checkGlob
     *
     * @param {string} glob - The glob of a path.
     *
     * @returns {void}
     */
    _checkGlob(glob) {
        if ( ! isString(glob) && ! isArray(glob)) {
            throw new InvalidGlobException(glob);
        }
    },

    /**
     * Check whether the options object is valid.
     *
     * @private
     * @function _checkOptions
     *
     * @param {string} options - The options object.
     *
     * @returns {void}
     */
    _checkOptions(options) {
        if ( isPresent(options) && ! isObject(options)) {
            throw new TypeException(options);
        }
    },

    /**
     * Check whether the the path entry under name exists.
     *
     * @private
     * @function _checkPathExists
     *
     * @param {string} name   - The name of the path entry.
     * @param {string} [glob] - The glob of the path.
     *
     * @returns {void}
     */
    _checkPathExists(name, glob) {
        if (name === this._options.rootName) {
            return;
        }

        if ( ! this.has(name) ) {
            throw new PathNotFoundException(name, glob);
        }
    },

    /**
     * Returns the index for an existing token if an existing token pattern can be found in the string.
     *
     * @private
     * @function _getTokenIndexFor
     *
     * @param {string} string - The string to check.
     *
     * @returns {number} If the string contains an index for an existing token, returns its index.
     *                   Otherwise returns -1;
     */
    _getTokenIndexFor(string) {
        let tokenIndex = -1;

        if (isString(string) && ! isEmptyString(string)) {
            foreach(
                this._tokens,
                /**
                 * @param {number} index - The index of the token.
                 * @param {RegExp} token - The token compiled to RegExp.
                 */
                (index, token) => {
                    if (token.test(string)) {
                        tokenIndex = index;

                        return false;
                    }
                }
            );
        }

        return tokenIndex;
    },

    /**
     * Determines whether the string contains tokens.
     *
     * @private
     * @function _containsToken
     *
     * @param {string} string - The string to check.
     *
     * @returns {boolean} If the string contains token, returns true.
     */
    _containsToken(string) {
        return this._getTokenIndexFor(string) > -1;
    },

    /**
     * Resolves the path by name-tokens.
     *
     * @private
     * @function _resolveNameTokens
     *
     * @param {string} glob - The glob path. A name-token could be e.g.: <root>
     *                        If the resolved name-token is an array containing multiple paths,
     *                        only the 1st of those paths will be used -- for more information check the source.
     *
     * @returns {string} The resolved glob path.
     */
    _resolveNameTokens(glob) {
        const index = this._getTokenIndexFor(glob);

        return glob.replace(this._tokens[index], (match, name) => {
            this._checkPathExists(name, glob);

            let path = this.get(name);

            // if the path consists of multiple globs in an array, only the 1st glob in the array will be used
            if (isArray(path)) {
                path = path[0];
            }

            return path;
        });
    },

    /**
     * Filters the given glob path by the passed options.
     *
     * @private
     * @function _filterGlob
     *
     * @param {string} glob                    - The glob path.
     * @param {Object} [options=Path.DEFAULTS] - The options that used to filter the glob path.
     *                                           see: {@link js.task.Path.DEFAULTS}
     *
     * @returns {string} The filtered glob path.
     */
    _filterGlob(glob, options) {
        this._checkGlob(glob);
        this._checkOptions(options);

        let filteredGlob = this._resolveNameTokens(glob);

        filteredGlob = nodePath.normalize(filteredGlob);

        return filteredGlob;
    },

    /**
     * Processes the given glob path by the given options.
     *
     * @private
     * @function _processGlob
     *
     * @param {string|Array} glob                    - The glob path.
     * @param {Object}       [options=Path.DEFAULTS] - The options that used to filter the glob path.
     *                                                 see: {@link js.task.Path.DEFAULTS}
     *
     * @returns {string|Array} The filtered glob path.
     */
    _processGlob(glob, options) {
        let filteredGlob;

        if (isArray(glob)) {
            filteredGlob = [];

            glob.forEach((entry) => {
                filteredGlob.push(this._filterGlob(entry, options));
            });

        } else {
            filteredGlob = this._filterGlob(glob, options);
        }

        return filteredGlob;
    },

    _setGlobPath(object, name, glob, options) {
        this._checkName(name);
        this._checkGlob(glob);
        this._checkOptions(options);

        const processedGlob = this._processGlob(glob, options);

        object[name] = processedGlob;

        return processedGlob;
    },
};

// use a shorthand, a fairly know convention named 'self'
// to represent 'static' properties and methods of Path
/**
 * @ignore
 * @type {js.task.Path}
 */
self = Path;

/**
 * The default name for root path.
 *
 * @public
 * @static
 * @const {string} DEFAULT_ROOT_NAME
 * @default root
 *
 * @memberOf js.task.Path
 */
self.DEFAULT_ROOT_NAME = 'root';

/**
 * The default name tokens.
 *
 * @public
 * @static
 * @const {string[]} DEFAULT_TOKENS
 *
 * @memberOf js.task.Path
 */
self.DEFAULT_TOKENS = [
    '<',  '>',
    '<<', '>>',

    '@',  '@',
    '{@', '@}',

    '{%', '%}',
    '{{', '}}',
];

/**
 * The default value for creating a path, when doesn't exist.
 *
 * @public
 * @static
 * @const {number} CREATE_IF_PATH_NOT_EXISTS
 *
 * @memberOf js.task.Path
 */
self.CREATE_IF_PATH_NOT_EXISTS = 1;

/**
 * The default value for throwing an exception, when path doesn't exist.
 *
 * @public
 * @static
 * @const {number} THROW_IF_PATH_NOT_EXISTS
 *
 * @memberOf js.task.Path
 */
self.THROW_IF_PATH_NOT_EXISTS = 2;

/**
 * The default value for non-existent appendTo() path behaviour.
 *
 * @public
 * @static
 * @const {number} DEFAULT_APPEND
 *
 * @memberOf js.task.Path
 */
self.DEFAULT_APPEND = self.CREATE_IF_PATH_NOT_EXISTS;

/**
 * The default values for Path.
 *
 * @public
 * @static
 * @const {{}} DEFAULTS
 *
 * @memberOf js.task.Path
 */
self.DEFAULTS = {
    rootName : self.DEFAULT_ROOT_NAME,
    tokens   : self.DEFAULT_TOKENS,
    append   : self.DEFAULT_APPEND,
};

module.exports = new self();
