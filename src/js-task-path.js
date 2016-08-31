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
const nodePath      = require('path'),
      appRootPath   = require('app-root-path'),
      extend        = require('extend'),
      foreach       = require('js-partial-foreach'),
      isPresent     = require('js-partial-is-present'),
      isString      = require('js-partial-is-string'),
      isEmptyString = require('js-partial-is-empty-string'),
      isArray       = require('js-partial-is-array'),
      isObject      = require('js-partial-is-object'),
      arrayMerge    = require('js-partial-array-merge');
/*
 |----------------------------------------------------------------------------------------------------------------------
 | Exceptions
 |----------------------------------------------------------------------------------------------------------------------
 */
const InvalidGlobException     = require('./exception/InvalidGlobException'),
      InvalidPathNameException = require('./exception/InvalidPathNameException'),
      PathNotFoundException    = require('./exception/PathNotFoundException'),
      TypeException            = require('./exception/TypeException');

/**
 * @memberOf js.task
 * @class Path
 */
const self = class Path {

    /**
     * @constructor
     */
    constructor() {
        /**
         * The storage object for the named glob paths.
         *
         * @private {Object}
         * @default {}
         */
        this._paths = {};

        // set the default values of options
        this.setOptions({
            rootName : self.DEFAULT_ROOT_NAME,
            prefix   : self.DEFAULT_NAME_TOKEN.prefix,
            suffix   : self.DEFAULT_NAME_TOKEN.suffix,
        });

        // set the default value for root
        this.setRoot(appRootPath.toString());
    }

    /**
     * Gets the glob path by the given name.
     *
     * @function get
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     *
     * @returns {string|Array} The glob path.
     */
    get(name) {
        this._checkPathExists(name);

        if (name === this._options.rootName) {
            return this.getRoot();
        }

        return this._paths[name];
    }

    /**
     * Sets the given glob path by the given name.
     *
     * If the glob path by the same name already exists, it will be overridden.
     *
     * @function set
     * @memberOf js.task.Path
     *
     * @param {string}       name                     - The name of the glob path.
     * @param {string|Array} glob                     - The glob path. Can be an array of globs.
     * @param {Object}       [options=Paths.DEFAULTS] - The options that used to filter the glob path.
     *                                                  see: {@link js.task.Paths.DEFAULTS}
     *
     * @returns {string|Array} The filtered glob path.
     */
    set(name, glob, options) {
        return this._setGlobPath(this._paths, name, glob, options);
    }

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
    }

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
    }

    /**
     * Removes the glob path by the given name from the stored glob paths.
     *
     * @function remove
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     *
     * @returns {string|Array|null} The removed glob path.
     *                              If there was no matching named glob path in the stored glob paths, or
     *                              if the removal was unsuccessful by other means,
     *                              the return value will be null;
     */
    remove(name) {
        this._checkName(name);

        let removedGlob = null;

        if (this.has(name)) {
            removedGlob = this.get(name);

            delete this._paths[name];
        }

        return removedGlob;
    }

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
     * @param {Object}       [options=Paths.DEFAULTS] - The options that used to filter the glob path.
     *                                                  see: {@link js.task.Paths.DEFAULTS}
     *
     * @returns {string|Array} The new glob path, contains the appended glob path.
     */
    appendTo(name, glob, options) {
        this._checkName(name);
        this._checkGlob(glob);
        this._checkOptions(options);

        let filteredGlob;

        if ( ! this.has(name)) {
            filteredGlob = this.addPath(name, glob, options);

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

            } else {
                filteredGlob = this.get(name);
            }
        }

        return filteredGlob;
    }

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
     * @returns {string|Array|null} The removed glob path.
     *                              If there was no matching named glob path in the stored glob paths, or
     *                              if the removal was unsuccessful by other means,
     *                              the return value will be null;
     */
    removeFrom(name, glob) {
        this._checkName(name);
        this._checkGlob(glob);

        let removedGlob = null;

        if (this.has(name) && this.contains(name, glob)) {
            let processedGlob = this._processGlob(glob),
                storedGlob    = this.get(name);

            if (isString(processedGlob) && isString(storedGlob)) {
                if (processedGlob === storedGlob) {
                    this.remove(name);
                }

                removedGlob = processedGlob;

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

                removedGlob = processedGlob;
            }
        }

        return removedGlob;
    }

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
    }

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
    }

    /**
     * Returns the options of path.
     *
     * @function getOptions
     * @memberOf js.task.Path
     *
     * @returns {Object} The storage object, that holds the values of the options.
     */
    getOptions() {
        return extend(true, {}, this._options);
    }

    /**
     * Sets the options for paths.
     *
     * @function setOptions
     * @memberOf js.task.Path
     *
     * @param {Object} options The storage object, which holds the values of the options to change.
     *
     * @returns {void}
     */
    setOptions(options) {
        /**
         * The storage object for options
         *
         * @private {Object}
         * @default {}
         */
        this._options = this._options || {};

        extend(this._options, options);

        /**
         * The RegExp for matching name tokens.
         *
         * @private {RegExp}
         */
        this._nameTokenPattern = new RegExp(
            `\\s*(${this._options.prefix}[\\s\\-\\\\\\/.*\\w]+${this._options.suffix})\\s*`, 'i'
        );
    }

    /**
     * Returns the root glob path.
     *
     * The root glob path is determined at the instantiation of the Paths class.
     * Be cautious regarding the value of this root glob path, after the original root glob path is changed.
     *
     * @function getRoot
     * @memberOf js.task.Path
     *
     * @returns {string} The root glob path.
     */
    getRoot() {
        return this[`_${this._options.rootName}`];
    }

    /**
     * Sets the root glob path by the given glob path.
     *
     * As the root glob path is determined at the instantiation of the Paths class,
     * be cautious, when changing the root glob path to avoid unwanted errors.
     *
     * @function setRoot
     * @memberOf js.task.Path
     *
     * @param {string} glob - The root glob path.
     *
     * @returns {string} The new, filtered root glob path.
     */
    setRoot(glob) {
        return this._setGlobPath(this, `_${this._options.rootName}`, glob);
    }

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
    }

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
    }

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
    }

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
    }

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
        return glob.replace(this._nameTokenPattern, (match) => {
            const name = match.substr(1, match.length - 2);

            this._checkPathExists(name, glob);

            let path = this.get(name);

            // if the p consists of multiple globs in an array, only the 1st glob in the array will be used
            if (isArray(path)) {
                path = path[0];
            }

            return path;
        });
    }

    /**
     * Filters the given glob path by the passed options.
     *
     * @private
     * @function _filterGlob
     *
     * @param {string} glob                     - The glob path.
     * @param {Object} [options=Paths.DEFAULTS] - The options that used to filter the glob path.
     *                                            see: {@link js.task.Paths.DEFAULTS}
     *
     * @returns {string} The filtered glob path.
     */
    _filterGlob(glob, options) {
        this._checkGlob(glob);
        this._checkOptions(options);

        this.setOptions(options);

        let filteredGlob = this._resolveNameTokens(glob);
        filteredGlob = nodePath.normalize(filteredGlob);

        return filteredGlob;
    }

    /**
     * Processes the given glob path by the given options.
     *
     * @private
     * @function _processGlob
     *
     * @param {string|Array} glob                     - The glob path.
     * @param {Object}       [options=Paths.DEFAULTS] - The options that used to filter the glob path.
     *                                                  see: {@link js.task.Paths.DEFAULTS}
     *
     * @returns {string|Array} The filtered glob path.
     */
    _processGlob(glob, options) {
        let filteredGlob;

        if (isArray(glob)) {
            filteredGlob = [];

            foreach(
                glob,
                (entry) => {
                    filteredGlob.push(this._filterGlob(entry, options));
                }
            );

        } else {
            filteredGlob = this._filterGlob(glob, options);
        }

        return filteredGlob;
    }

    _setGlobPath(object, name, glob, options) {
        this._checkName(name);
        this._checkGlob(glob);
        this._checkOptions(options);

        const processedGlob = this._processGlob(glob, options);

        object[name] = processedGlob;

        return processedGlob;
    }
};

/**
 * The default name for root path.
 *
 * @public
 * @static
 * @const {string}
 * @default 'root'
 * @memberOf js.task.Paths
 */
self.DEFAULT_ROOT_NAME = 'root';

/**
 * The default name tokens.
 *
 * @public
 * @static
 * @const
 * @type {{prefix: string, suffix: string}}
 * @default {{prefix: '<', suffix: '>'}}
 * @memberOf js.task.Paths
 */
self.DEFAULT_NAME_TOKEN = {
    prefix : '<',
    suffix : '>',
};

module.exports = new self();
