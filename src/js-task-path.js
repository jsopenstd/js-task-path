'use strict';

/*
 |----------------------------------------------------------------------------------------------------------------------
 | A utility singleton to help manage task-related paths more easily throughout the whole project.
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

const path    = require(`path`),
      appRoot = require(`app-root-path`),
      extend  = require(`extend`),
      foreach = require(`js-partial-foreach`);
/*
 |----------------------------------------------------------------------------------------------------------------------
 | Exceptions
 |----------------------------------------------------------------------------------------------------------------------
 */
const InvalidGlobException     = require(`./exception/InvalidGlobException`),
      InvalidPathNameException = require(`./exception/InvalidPathNameException`),
      PathNotFoundException    = require(`./exception/PathNotFoundException`),
      TypeException            = require(`./exception/TypeException`);

/*
 |----------------------------------------------------------------------------------------------------------------------
 | Helper Functions
 |----------------------------------------------------------------------------------------------------------------------
 */
const isPresent = (object) => {
    return typeof object !== `undefined` &&
           object !== null;
};

const isString = (object) => {
    return typeof object === `string`;
};

const isEmptyString = (object) => {
    return typeof object === `string` &&
           (
               object.length === 0 ||
               /^\s+$/.test(object) === true
           );
};

const isArray = (object) => {
    return Object.prototype.toString.call(object) === `[object Array]`;
};

const isObject = (object) => {
    return Object.prototype.toString.call(object) === `[object Object]`;
};

const arrayMerge = (array, ...rest) => {
    return array.concat(...rest);
};

const self = class Path {

    /**
     * The default values of options, when adding paths.
     *
     * @const
     * @type {Object} DEFAULTS
     * @memberOf js/task/Paths
     */
    static get DEFAULTS() {
        return {
            /**
             * Whether use path.normalize(...) on passed globs.
             *
             * @type {boolean}
             * @default true
             */
            autoNormalizePath : true,

            /**
             *
             * @type {RegExp}
             * @default \s*(<[\s\-\\\/\.\*\w]+>)\s* /i
             */
            nameTokenPattern : /\s*(<[\s\-\\\/.*\w]+>)\s*/i,
        };
    }

    constructor() {
        /**
         * The root of the project determined when the Paths class was instantiated.
         *
         * @private {string}
         * @default ``
         */
        this._root  = ``;

        /**
         * The storage object for the named glob paths.
         *
         * @private {Object}
         * @default {}
         */
        this._paths = {};

        this.setRoot(appRoot.toString());
    }

    /**
     * Gets the glob path by the given name.
     *
     * Alias: {@link js/task/Paths#get}
     *
     * @method getPath
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     *
     * @returns {string|Array} The glob path.
     */
    getPath(name) {

        if ( ! this.hasPath(name) ) {
            throw new PathNotFoundException(name);
        }

        return this._paths[name];
    }

    /**
     * Sets the given glob path by the given name.
     *
     * If the glob path by the same name already exists, it will be overridden.
     * Alias: {@link js/task/Paths#set}
     *
     * @method setPath
     * @memberOf js.task.Path
     *
     * @param {string}       name                     - The name of the glob path.
     * @param {string|Array} glob                     - The glob path. Can be an array of globs.
     * @param {Object}       [options=Paths.DEFAULTS] - The options that used to filter the glob path.
     *                                                  see: {@link js/task/Paths.DEFAULTS}
     *
     * @returns {string|Array} The filtered glob path.
     */
    setPath(name, glob, options) {

        if ( ! isString(name) || isEmptyString(name) ) {
            throw new InvalidPathNameException(name);
        }

        if ( ! isString(glob) && ! isArray(glob) ) {
            throw new InvalidGlobException(glob);
        }

        if ( isPresent(options) && ! isObject(options) ) {
            throw new TypeException(options);
        }

        const processedGlob = this._processGlob(glob, options);

        this._paths[name] = processedGlob;

        return processedGlob;
    }

    /**
     * Returns whether a glob path by the given name was stored previously.
     *
     * Alias: {@link js/task/Paths#has}
     *
     * @method hasPath
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     *
     * @returns {boolean} Whether has a path under this name.
     */
    hasPath(name) {

        if ( ! isString(name) || isEmptyString(name) ) {
            throw new InvalidPathNameException(name);
        }

        return name in this._paths;
    }

    /**
     * Returns whether a previously stored glob path by the given name contains the given glob path.
     *
     * If the previously stored glob path is the same (if it is a string) as -
     * or contains (if it is an array of glob paths) - the given glob path, it will return true.
     * Alias: {@link js/task/Paths#contains}
     *
     * @method containsPath
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     * @param {string} glob - The glob path.

     * @returns {boolean} Whether the path with a name contains the glob.
     */
    containsPath(name, glob) {

        if ( ! isString(name) || isEmptyString(name) ) {
            throw new InvalidPathNameException(name);
        }

        if ( ! isString(glob) && ! isArray(glob) ) {
            throw new InvalidGlobException(glob);
        }

        let filteredGlob,
            storedGlob;

        if (this.hasPath(name)) {
            filteredGlob = this._filterGlob(glob);
            storedGlob   = this.getPath(name);

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
     * Alias: {@link js/task/Paths#remove}
     *
     * @method removePath
     * @memberOf js.task.Path
     *
     * @param {string} name - The name of the glob path.
     *
     * @returns {string|Array|null} The removed glob path.
     *                              If there was no matching named glob path in the stored glob paths, or
     *                              if the removal was unsuccessful by other means,
     *                              the return value will be null;
     */
    removePath(name) {
        if ( ! isString(name) || isEmptyString(name) ) {
            throw new InvalidPathNameException(name);
        }

        let removedGlob = null;

        if (this.hasPath(name)) {
            removedGlob = this.getPath(name);

            delete this._paths[name];
        }

        return removedGlob;
    }

    /**
     * Appends the given glob path to the given name.
     *
     * If there is no stored glob path under the given name,
     * it will be added anyway, as just as it was added via setPath(...).
     * Alias: {@link js/task/Paths#appendTo}
     *
     * @method appendToPath
     * @memberOf js.task.Path
     *
     * @param {string}       name                     - The name of the glob path.
     * @param {string|Array} glob                     - The glob path. Can be an array of globs.
     * @param {Object}       [options=Paths.DEFAULTS] - The options that used to filter the glob path.
     *                                                  see: {@link js/task/Paths.DEFAULTS}
     *
     * @returns {string|Array} The new glob path, contains the appended glob path.
     */
    appendToPath(name, glob, options) {

        if ( ! isString(name) || isEmptyString(name) ) {
            throw new InvalidPathNameException(name);
        }

        if ( ! isString(glob) && ! isArray(glob) ) {
            throw new InvalidGlobException(glob);
        }

        if ( isPresent(options) && ! isObject(options) ) {
            throw new TypeException(options);
        }

        let filteredGlob;

        if ( ! this.hasPath(name)) {
            filteredGlob = this.addPath(name, glob, options);

        } else {
            // only append to the given name, if the stored glob isn't equal to/doesn't contain the given glob
            if ( ! this.containsPath(name, glob)) {
                let storedGlob = this.getPath(name);

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
                filteredGlob = this.getPath(name);
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
     * Alias: {@link js/task/Paths#removeFrom}
     *
     * @method removeFromPath
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
    removeFromPath(name, glob) {

        if ( ! isString(name) || isEmptyString(name) ) {
            throw new InvalidPathNameException(name);
        }

        if ( ! isString(glob) && ! isArray(glob) ) {
            throw new InvalidGlobException(glob);
        }

        let removedGlob = null;

        if (this.hasPath(name) && this.containsPath(name, glob)) {
            let processedGlob = this._processGlob(glob),
                storedGlob    = this.getPath(name);

            if (isString(processedGlob) && isString(storedGlob)) {
                if (processedGlob === storedGlob) {
                    this.removePath(name);
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
                    this.removePath(name);
                }

                removedGlob = processedGlob;
            }
        }

        return removedGlob;
    }

    /**
     * Returns the root glob path.
     *
     * The root glob path is determined at the instantiation of the Paths class.
     * Be cautious regarding the value of this root glob path, after the original root glob path is changed.
     *
     * @method getRoot
     * @memberOf js.task.Path
     *
     * @returns {string} The root glob path.
     */
    getRoot() {
        return this._root;
    }

    /**
     * Sets the root glob path by the given glob path.
     *
     * As the root glob path is determined at the instantiation of the Paths class,
     * be cautious, when changing the root glob path to avoid unwanted errors.
     *
     * @method setRoot
     * @memberOf js.task.Path
     *
     * @param {string} glob - The root glob path.
     *
     * @returns {string} The new, filtered root glob path.
     */
    setRoot(glob) {
        this._root = this.setPath(`root`, glob);

        return this._root;
    }

    /**
     * Returns all of the stored named glob paths.
     *
     * The returned object will be a deep copy of the original object,
     * modifying the returned object will not change the original object.
     *
     * @method getAll
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
     * @method removeAll
     * @memberOf js.task.Path
     *
     * @param {boolean} [removeRoot=false] - Remove the `root` named glob path too.
     *                                       Be cautious, when removing the root glob path
     *                                       to avoid unwanted errors.
     *
     * @returns {Object} Returns the removed named glob paths.
     *                   For example: { `src` : `/root/src` }
     */
    removeAll(removeRoot = false) {
        const removedGlobs = this.getAll();

        this._paths = {};

        if ( ! removeRoot) {
            this._paths[`root`] = this._root;

            // if removeRoot === false, the `root` named glob path will be still stored, and since `root`
            // practically wasn't removed from the stored glob paths,
            // do not return it as the part of removedGlobs
            delete removedGlobs[`root`];
        }

        return removedGlobs;
    }

    /**
     * Resolves the path by name-tokens.
     *
     * @private
     *
     * @param {string} glob - The glob path. A name-token could be e.g.: <root>
     *                        If the resolved name-token is an array containing multiple paths,
     *                        only the 1st of those paths will be used -- for more information check the source.
     *
     * @returns {string} The resolved glob path.
     */
    _resolveNameTokens(glob) {
        return glob.replace(self.DEFAULTS.nameTokenPattern, (match) => {

            const name = match.substr(1, match.length - 2);

            if ( ! this.hasPath(name)) {
                throw new PathNotFoundException(name, glob);
            }

            let p = this.getPath(name);

            // if the p consists of multiple globs in an array, only the 1st glob in the array will be used
            if (isArray(p)) {
                p = p[0];
            }

            return p;
        });
    }

    /**
     * Filters the given glob path by the passed options.
     *
     * @private
     *
     * @param {string} glob                     - The glob path.
     * @param {Object} [options=Paths.DEFAULTS] - The options that used to filter the glob path.
     *                                            see: {@link js/task/Paths.DEFAULTS}
     *
     * @returns {string} The filtered glob path.
     */
    _filterGlob(glob, options) {

        const opt = extend(true, {}, self.DEFAULTS, options);

        let filteredGlob = this._resolveNameTokens(glob);

        if (opt.autoNormalizePath) {
            filteredGlob = path.normalize(filteredGlob);
        }

        return filteredGlob;
    }

    /**
     * Processes the given glob path by the given options.
     *
     * @private
     *
     * @param {string|Array} glob                     - The glob path.
     * @param {Object}       [options=Paths.DEFAULTS] - The options that used to filter the glob path.
     *                                                  see: {@link js/task/Paths.DEFAULTS}
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
};

const Path = new self();

// add `.exception` namespace for easy exception access
extend(
    Path,
    {
        exception :
        {
            InvalidGlobException,
            InvalidPathNameException,
            PathNotFoundException,
            TypeException,
        },
    }
);

module.exports = Path;
