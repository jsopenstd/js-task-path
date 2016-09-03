'use strict';

/*
 |----------------------------------------------------------------------------------------------------------------------
 | A helper class to manage task-, build- and deployment-related paths more easily throughout the whole project.
 |----------------------------------------------------------------------------------------------------------------------
 */

/**
 * More information on [JavaScript Open Standards]{@link https://github.com/jsopenstd/jsopenstd}.
 *
 * @namespace js.task.path
 * @version 2.0.3
 *
 * @author Richard King <richrdkng@gmail.com> [GitHub]{@link https://github.com/richrdkng}
 * @license [MIT]{@link https://github.com/jsopenstd/js-partial-foreach/blob/master/license.md}
 */

/*
 |----------------------------------------------------------------------------------------------------------------------
 | Essential Modules
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

/*
 |----------------------------------------------------------------------------------------------------------------------
 | 'self' for the module's class (Path)
 |
 | use a shorthand, a fairly known convention named 'self'
 | to represent 'static' properties and methods of the module's class (Path) in a short form
 |----------------------------------------------------------------------------------------------------------------------
 */
const self = (() => {
    return extend(

        /*
         |--------------------------------------------------------------------------------------------------------------
         | Constructor
         |--------------------------------------------------------------------------------------------------------------
         */

        /**
         * The helper class to manage **task-**, **build-** and **deployment-related** paths more easily throughout
         * the whole project.
         *
         * @class Path
         * @memberOf js.task.path
         */
        function Path() {
            // create a placeholder function as a base function for further extension

            /**
             * A getter/setter shorthand for path.
             *
             * @public
             * @instance
             * @function ()
             * @memberOf js.task.path.Path
             *
             * @param {string|{}}       name   - The name of the glob.
             *                                   If it is an object, multiple path globs can be set at once.
             * @param {string|string[]} [glob] - The glob of path.
             *
             * @returns {string|string[]|Path} If used as a getter, returns glob of path.
             *                                 If used a setter, returns Path to provide chainability.
             */
            const instance = function PathInstance(name, glob) {

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
             |----------------------------------------------------------------------------------------------------------
             | Extension and Instantiations
             |----------------------------------------------------------------------------------------------------------
             */

            // extend the placeholder function with Path's prototype
            // as the placeholder function will behave as an instance of Path and '.this' will be properly usable,
            // but at the same time it will be still just a function and it can be just simply called
            // providing a shorthand getter/setter functionality for the path globs (e.g.: path('<root>'))
            extend(
                instance,
                Path.prototype,
                self
            );

            // resets the path to default values.
            instance.reset();

            // return the placeholder function with all the necessary functionality from Path's prototype
            // and with initial, instantiated values
            return instance;
        },

        /*
         |--------------------------------------------------------------------------------------------------------------
         | Constants
         |--------------------------------------------------------------------------------------------------------------
         */
        (() => {
            const constant = {};

            /**
             * The default name for root path.
             *
             * @public
             * @static
             * @const {string} DEFAULT_ROOT_NAME
             * @default root
             *
             * @memberOf js.task.path.Path
             */
            constant.DEFAULT_ROOT_NAME = 'root';

            /**
             * The default name tokens.
             *
             * @public
             * @static
             * @const {string[]} DEFAULT_TOKENS
             *
             * @memberOf js.task.path.Path
             */
            constant.DEFAULT_TOKENS = [
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
             * @memberOf js.task.path.Path
             */
            constant.CREATE_IF_PATH_NOT_EXISTS = 1;

            /**
             * The default value for throwing an exception, when path doesn't exist.
             *
             * @public
             * @static
             * @const {number} THROW_IF_PATH_NOT_EXISTS
             *
             * @memberOf js.task.path.Path
             */
            constant.THROW_IF_PATH_NOT_EXISTS = 2;

            /**
             * The default value for non-existent appendTo() path behaviour.
             *
             * @public
             * @static
             * @const {number} DEFAULT_APPEND
             *
             * @memberOf js.task.path.Path
             */
            constant.DEFAULT_APPEND = constant.CREATE_IF_PATH_NOT_EXISTS;

            /**
             * The default values for Path.
             *
             * @public
             * @static
             * @const {{}} DEFAULTS
             *
             * @memberOf js.task.path.Path
             */
            constant.DEFAULTS = {
                rootName : constant.DEFAULT_ROOT_NAME,
                tokens   : constant.DEFAULT_TOKENS,
                append   : constant.DEFAULT_APPEND,
            };

            return constant;
        })(),

        /*
         |--------------------------------------------------------------------------------------------------------------
         | Instance Functions
         |--------------------------------------------------------------------------------------------------------------
         */
        {
            prototype : {
                /*
                 |------------------------------------------------------------------------------------------------------
                 | Public Functions
                 |------------------------------------------------------------------------------------------------------
                 */

                /**
                 * Gets the glob path by the given name.
                 *
                 * @public
                 * @instance
                 * @function get
                 * @memberOf js.task.path.Path
                 *
                 * @param {string} name - The name of the glob path.
                 *                        If the name contains an existing
                 *                        path name (e.g.: path.get('<root>/package.json')), then it will be
                 *                        automatically resolved.
                 *
                 * @returns {string|string[]} The glob path.
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
                 * @public
                 * @instance
                 * @function set
                 * @memberOf js.task.path.Path
                 *
                 * @param {string}          name - The name of the glob path.
                 * @param {string|string[]} glob - The glob path. Can be an array of globs.
                 *
                 * @returns {Path} The path instance to provide chainability.
                 */
                set(name, glob) {
                    this._setGlobPath(this._paths, name, glob);

                    return this;
                },

                /**
                 * Returns whether a glob path by the given name was stored previously.
                 *
                 * @public
                 * @instance
                 * @function has
                 * @memberOf js.task.path.Path
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
                 * @public
                 * @instance
                 * @function contains
                 * @memberOf js.task.path.Path
                 *
                 * @param {string}          name - The name of the glob path.
                 * @param {string|string[]} glob - The glob path of multiple glob paths to check.

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
                            if (isString(filteredGlob)) {
                                filteredGlob = [filteredGlob];
                            }

                            let contains = true;

                            filteredGlob.forEach(
                                (value) => {
                                    if (storedGlob.indexOf(value) === -1) {
                                        contains = false;

                                        return false;
                                    }
                                }
                            );

                            return contains;
                        }

                        return filteredGlob === storedGlob;
                    }

                    return false;
                },

                /**
                 * Removes the glob path by the given name from the stored glob paths.
                 *
                 * @public
                 * @instance
                 * @function remove
                 * @memberOf js.task.path.Path
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
                 * @public
                 * @instance
                 * @function appendTo
                 * @memberOf js.task.path.Path
                 *
                 * @param {string}          name - The name of the glob path.
                 * @param {string|string[]} glob - The glob path. Can be an array of globs.
                 *
                 * @returns {Path} The path instance to provide chainability.
                 */
                appendTo(name, glob) {
                    this._checkName(name);
                    this._checkGlob(glob);

                    let filteredGlob;

                    if ( ! this.has(name)) {
                        switch (this._options.append) {
                            case self.CREATE_IF_PATH_NOT_EXISTS:
                                this.set(name, glob);
                                break;

                            case self.THROW_IF_PATH_NOT_EXISTS:
                                throw new PathNotFoundException(name, glob);

                            // skip default case, it's not needed
                        }

                    } else {
                        // only append to the given name, if the stored glob
                        // isn't equal to/doesn't contain the given glob
                        if ( ! this.contains(name, glob)) {
                            let storedGlob = this.get(name);

                            // if the stored glob isn't an array, convert it
                            if (isString(storedGlob) ) {
                                storedGlob = [storedGlob];
                            }

                            filteredGlob = this._processGlob(glob);

                            // if the processed glob isn't an array, convert it
                            if (isString(filteredGlob)) {
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
                 * @public
                 * @instance
                 * @function removeFrom
                 * @memberOf js.task.path.Path
                 *
                 * @param {string}          name - The name of the glob path.
                 * @param {string|string[]} glob - The glob path. Can be an array of globs.
                 *
                 * @returns {void}
                 */
                removeFrom(name, glob) {
                    this._checkName(name);
                    this._checkGlob(glob);

                    if (this.has(name) && this.contains(name, glob)) {
                        let processedGlob = this._processGlob(glob),
                            storedGlob    = this.get(name);

                        // if globs are string and they are the same (the glob to be removed is the only one)
                        // delete the glob path, since empty glob paths are not allowed
                        if (isString(processedGlob) &&
                            isString(storedGlob) &&
                            processedGlob === storedGlob) {

                            this.remove(name);

                        } else {
                            if (isString(processedGlob)) {
                                processedGlob = [processedGlob];
                            }

                            if (isString(storedGlob)) {
                                storedGlob = [storedGlob];
                            }

                            processedGlob.forEach(
                                (processedGlobEntry) => {
                                    const index = storedGlob.indexOf(processedGlobEntry);

                                    storedGlob.splice(index, 1);
                                }
                            );

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
                 * @public
                 * @instance
                 * @function getAll
                 * @memberOf js.task.path.Path
                 *
                 * @returns {{}} The object containing all of the named glob paths.
                 */
                getAll() {
                    return extend(true, {}, this._paths);
                },

                /**
                 * Removes all the stored named glob paths.
                 *
                 * @public
                 * @instance
                 * @function removeAll
                 * @memberOf js.task.path.Path
                 *
                 * @returns {void}
                 */
                removeAll() {
                    this._paths = {};
                },

                /**
                 * Resets the path with default options.
                 * Also deletes every previously set path globs and sets the root back to the original path.
                 *
                 * @public
                 * @instance
                 * @function reset
                 * @memberOf js.task.path.Path
                 *
                 * @returns {void}
                 */
                reset() {
                    /**
                     * The storage object for the named glob paths.
                     *
                     * @private {{}}
                     * @default {}
                     */
                    this._paths = {};

                    /**
                     * The storage object for options
                     *
                     * @private {{}}
                     * @default {}
                     */
                    this._options = {};

                    this.removeAll();
                    this.setOptions(self.DEFAULTS);
                    this.setRoot(appRootPath.toString());
                },

                /**
                 * Returns the options of path.
                 *
                 * @public
                 * @instance
                 * @function getOptions
                 * @memberOf js.task.path.Path
                 *
                 * @param {string} [specificOption] - If specified, the specific option
                 *                                    with that name will be returned.
                 *
                 * @returns {{}|*} The storage object, that holds the values of the options.
                 *                 If a specific option was specified, return that specific option.
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
                 * @public
                 * @instance
                 * @function setOptions
                 * @memberOf js.task.path.Path
                 *
                 * @param {{}} options - The storage object, which holds the values of the options to change.
                 *
                 * @returns {void}
                 */
                setOptions(options) {
                    this._checkOptions(options);

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

                                // construct a new RegExp pattern from the actual prefix and suffix, then prepare them
                                // for the next token iteration by resetting them (prefix = suffix = null)
                                if (prefix && suffix) {
                                    this._tokens.unshift(
                                        new RegExp(`\\s*${prefix}([\\s\\-\\\\\\/.*\\w]+)${suffix}\\s*`, 'i')
                                    );
                                    prefix = suffix = null;
                                }
                            }
                        );
                    }

                    // sort RegExp patterns to check longer tokens first and shortest last
                    // to ensure proper token resolution
                    this._tokens = this._tokens.sort().reverse();
                },

                /**
                 * Returns the root glob path.
                 *
                 * The root glob path is determined at the instantiation of the Path class.
                 * Be cautious regarding the value of this root glob path,
                 * after the original root glob path is changed.
                 *
                 * @public
                 * @instance
                 * @function getRoot
                 * @memberOf js.task.path.Path
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
                 * @public
                 * @instance
                 * @function setRoot
                 * @memberOf js.task.path.Path
                 *
                 * @param {string} glob - The root glob path.
                 *
                 * @returns {void}
                 */
                setRoot(glob) {
                    this._setGlobPath(this, `_${this._options.rootName}`, glob);
                },

                /*
                 |------------------------------------------------------------------------------------------------------
                 | Private Functions
                 |------------------------------------------------------------------------------------------------------
                 */

                /**
                 * Check whether the name is valid.
                 *
                 * @private
                 * @instance
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
                 * @instance
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
                 * @instance
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
                 * @instance
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
                 * @instance
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
                 * @instance
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
                 * @instance
                 * @function _resolveNameTokens
                 *
                 * @param {string|string[]} glob - The glob path. A name-token could be e.g.: <root>
                 *                                 If the resolved name-token is an array containing multiple paths,
                 *                                 only the 1st of those paths will be used -- for more information
                 *                                 check the source.
                 *
                 * @returns {string|string[]} The resolved glob path.
                 */
                _resolveNameTokens(glob) {
                    let globs = glob;

                    if (isString(glob)) {
                        globs = [glob];
                    }

                    globs.forEach(
                        (value, index, array) => {
                            const globValue  = value,
                                  tokenIndex = this._getTokenIndexFor(globValue);

                            array[index] = globValue.replace(this._tokens[tokenIndex], (match, name) => {
                                this._checkPathExists(name, globValue);

                                let path = this.get(name);

                                // if the path consists of multiple globs in an array,
                                // only the 1st glob in the array will be used
                                if (isArray(path)) {
                                    path = path[0];
                                }

                                return path;
                            });
                        }
                    );

                    // if it contains only one glob, then return just that one
                    // and the return value will be a string
                    if (globs.length === 1) {
                        return globs[0];
                    }

                    // be default, the return value will be a string[]
                    return globs;
                },

                /**
                 * Filters the given glob path by the passed options.
                 *
                 * @private
                 * @instance
                 * @function _filterGlob
                 *
                 * @param {string|string[]} glob - The glob path or multiple glob paths.
                 *
                 * @returns {string|string[]} The filtered glob path.
                 */
                _filterGlob(glob) {
                    this._checkGlob(glob);

                    let filteredGlob = this._resolveNameTokens(glob);

                    if (isString(filteredGlob)) {
                        filteredGlob = [filteredGlob];
                    }

                    filteredGlob.forEach(
                        (value, index, array) => {
                            array[index] = nodePath.normalize(value);
                        }
                    );

                    // if it contains only one glob, then return just that one
                    // and the return value will be a string
                    if (filteredGlob.length === 1) {
                        return filteredGlob[0];
                    }

                    // be default, the return value will be a string[]
                    return filteredGlob;
                },

                /**
                 * Processes the given glob path by the given options.
                 *
                 * @private
                 * @instance
                 * @function _processGlob
                 *
                 * @param {string|string[]} glob - The glob path.
                 *
                 * @returns {string|string[]} The filtered glob path.
                 */
                _processGlob(glob) {
                    let filteredGlob;

                    if (isArray(glob)) {
                        filteredGlob = [];

                        glob.forEach(
                            (entry) => {
                                filteredGlob.push(this._filterGlob(entry));
                            }
                        );

                    } else {
                        filteredGlob = this._filterGlob(glob);
                    }

                    return filteredGlob;
                },

                /**
                 * Sets glob path in the given object.
                 *
                 * @private
                 * @instance
                 * @function _setGlobPath
                 *
                 * @param {{}}              object - The object in which the glob path will be set.
                 * @param {string}          name   - The name of the glob.
                 * @param {string|string[]} glob   - The blog path.
                 *
                 * @returns {string|string[]} The glob, that was set in the given object.
                 */
                _setGlobPath(object, name, glob) {
                    this._checkName(name);
                    this._checkGlob(glob);

                    const processedGlob = this._processGlob(glob);

                    object[name] = processedGlob;

                    return processedGlob;
                },
            },
        }
    );
})();

module.exports = new self();
