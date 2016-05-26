<a name="js/task/Paths"></a>

## js/task/Paths
**Kind**: global class  

* [js/task/Paths](#js/task/Paths)
    * [new js/task/Paths()](#new_js/task/Paths_new)
    * _instance_
        * [.getPath(name)](#js/task/Paths+getPath) ⇒ <code>string</code> &#124; <code>Array</code>
        * [.setPath(name, glob, [options])](#js/task/Paths+setPath) ⇒ <code>string</code> &#124; <code>Array</code>
        * [.hasPath(name)](#js/task/Paths+hasPath) ⇒ <code>boolean</code>
        * [.containsPath(name, glob)](#js/task/Paths+containsPath) ⇒ <code>boolean</code>
        * [.removePath(name)](#js/task/Paths+removePath) ⇒ <code>string</code> &#124; <code>Array</code> &#124; <code>null</code>
        * [.appendToPath(name, glob, [options])](#js/task/Paths+appendToPath) ⇒ <code>string</code> &#124; <code>Array</code>
        * [.removeFromPath(name, glob)](#js/task/Paths+removeFromPath) ⇒ <code>string</code> &#124; <code>Array</code> &#124; <code>null</code>
        * [.getRoot()](#js/task/Paths+getRoot) ⇒ <code>string</code>
        * [.setRoot(glob)](#js/task/Paths+setRoot) ⇒ <code>string</code>
        * [.getAll()](#js/task/Paths+getAll) ⇒ <code>Object</code>
        * [.removeAll([removeRoot])](#js/task/Paths+removeAll) ⇒ <code>Object</code>
        * [.get()](#js/task/Paths+get)
        * [.set()](#js/task/Paths+set)
        * [.has()](#js/task/Paths+has)
        * [.contains()](#js/task/Paths+contains)
        * [.remove()](#js/task/Paths+remove)
        * [.add()](#js/task/Paths+add)
        * [.appendTo()](#js/task/Paths+appendTo)
        * [.removeFrom()](#js/task/Paths+removeFrom)
    * _static_
        * [.DEFAULTS](#js/task/Paths.DEFAULTS) : <code>Object</code>
            * [.autoNormalizePath](#js/task/Paths.DEFAULTS.autoNormalizePath) : <code>boolean</code>
            * [.nameTokenPattern](#js/task/Paths.DEFAULTS.nameTokenPattern) : <code>RegExp</code>

<a name="new_js/task/Paths_new"></a>

### new js/task/Paths()
A utility singleton to help manage task-related paths more easily throughout the whole project.

<a name="js/task/Paths+getPath"></a>

### js/task/Paths.getPath(name) ⇒ <code>string</code> &#124; <code>Array</code>
Gets the glob path by the given name.

Alias: [get](#js/task/Paths+get)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**Returns**: <code>string</code> &#124; <code>Array</code> - The glob path.  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the glob path. |

<a name="js/task/Paths+setPath"></a>

### js/task/Paths.setPath(name, glob, [options]) ⇒ <code>string</code> &#124; <code>Array</code>
Sets the given glob path by the given name.

If the glob path by the same name already exists, it will be overridden.
Alias: [set](#js/task/Paths+set)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**Returns**: <code>string</code> &#124; <code>Array</code> - The filtered glob path.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | The name of the glob path. |
| glob | <code>string</code> &#124; <code>Array</code> |  | The glob path. Can be an array of globs. |
| [options] | <code>Object</code> | <code>Paths.DEFAULTS</code> | The options that used to filter the glob path.                                                  see: [DEFAULTS](#js/task/Paths.DEFAULTS) |

<a name="js/task/Paths+hasPath"></a>

### js/task/Paths.hasPath(name) ⇒ <code>boolean</code>
Returns whether a glob path by the given name was stored previously.

Alias: [has](#js/task/Paths+has)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the glob path. |

<a name="js/task/Paths+containsPath"></a>

### js/task/Paths.containsPath(name, glob) ⇒ <code>boolean</code>
Returns whether a previously stored glob path by the given name contains the given glob path.

If the previously stored glob path is the same (if it is a string) as -
or contains (if it is an array of glob paths) - the given glob path, it will return true.
Alias: [contains](#js/task/Paths+contains)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the glob path. |
| glob | <code>string</code> | The glob path. |

<a name="js/task/Paths+removePath"></a>

### js/task/Paths.removePath(name) ⇒ <code>string</code> &#124; <code>Array</code> &#124; <code>null</code>
Removes the glob path by the given name from the stored glob paths.

Alias: [remove](#js/task/Paths+remove)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**Returns**: <code>string</code> &#124; <code>Array</code> &#124; <code>null</code> - The removed glob path.
                             If there was no matching named glob path in the stored glob paths, or
                             if the removal was unsuccessful by other means,
                             the return value will be null;  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the glob path. |

<a name="js/task/Paths+appendToPath"></a>

### js/task/Paths.appendToPath(name, glob, [options]) ⇒ <code>string</code> &#124; <code>Array</code>
Appends the given glob path to the given name.

If there is no stored glob path under the given name,
it will be added anyway, as just as it was added via setPath(...).
Alias: [appendTo](#js/task/Paths+appendTo)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**Returns**: <code>string</code> &#124; <code>Array</code> - The new glob path, contains the appended glob path.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| name | <code>string</code> |  | The name of the glob path. |
| glob | <code>string</code> &#124; <code>Array</code> |  | The glob path. Can be an array of globs. |
| [options] | <code>Object</code> | <code>Paths.DEFAULTS</code> | The options that used to filter the glob path.                                                  see: [DEFAULTS](#js/task/Paths.DEFAULTS) |

<a name="js/task/Paths+removeFromPath"></a>

### js/task/Paths.removeFromPath(name, glob) ⇒ <code>string</code> &#124; <code>Array</code> &#124; <code>null</code>
Removes the given glob path by the given name.

After the successful removal of the given glob path,
if the given name will be empty (as the last glob path was removed),
it will be removed from the stored named glob paths.
Alias: [removeFrom](#js/task/Paths+removeFrom)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**Returns**: <code>string</code> &#124; <code>Array</code> &#124; <code>null</code> - The removed glob path.
                             If there was no matching named glob path in the stored glob paths, or
                             if the removal was unsuccessful by other means,
                             the return value will be null;  

| Param | Type | Description |
| --- | --- | --- |
| name | <code>string</code> | The name of the glob path. |
| glob | <code>string</code> &#124; <code>Array</code> | The glob path. Can be an array of globs. |

<a name="js/task/Paths+getRoot"></a>

### js/task/Paths.getRoot() ⇒ <code>string</code>
Returns the root glob path.

The root glob path is determined at the instantiation of the Paths class.
Be cautious regarding the value of this root glob path, after the original root glob path is changed.

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**Returns**: <code>string</code> - The root glob path.  
<a name="js/task/Paths+setRoot"></a>

### js/task/Paths.setRoot(glob) ⇒ <code>string</code>
Sets the root glob path by the given glob path.

As the root glob path is determined at the instantiation of the Paths class,
be cautious, when changing the root glob path to avoid unwanted errors.

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**Returns**: <code>string</code> - The new, filtered root glob path.  

| Param | Type | Description |
| --- | --- | --- |
| glob | <code>string</code> | The root glob path. |

<a name="js/task/Paths+getAll"></a>

### js/task/Paths.getAll() ⇒ <code>Object</code>
Returns all of the stored named glob paths.

The returned object will be a deep copy of the original object,
modifying the returned object will not change the original object.

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**Returns**: <code>Object</code> - The object containing all of the named glob paths.  
<a name="js/task/Paths+removeAll"></a>

### js/task/Paths.removeAll([removeRoot]) ⇒ <code>Object</code>
Removes all the stored named glob paths.

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**Returns**: <code>Object</code> - Returns the removed named glob paths.
                  For example: { "src" : "/root/src" }  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| [removeRoot] | <code>boolean</code> | <code>false</code> | Remove the "root" named glob path too.                                       Be cautious, when removing the root glob path                                       to avoid unwanted errors. |

<a name="js/task/Paths+get"></a>

### js/task/Paths.get()
Alias of [getPath](#js/task/Paths+getPath)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**See**: [getPath](#js/task/Paths+getPath)  
<a name="js/task/Paths+set"></a>

### js/task/Paths.set()
Alias of [setPath](#js/task/Paths+setPath)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**See**: [setPath](#js/task/Paths+setPath)  
<a name="js/task/Paths+has"></a>

### js/task/Paths.has()
Alias of [hasPath](#js/task/Paths+hasPath)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**See**: [hasPath](#js/task/Paths+hasPath)  
<a name="js/task/Paths+contains"></a>

### js/task/Paths.contains()
Alias of [containsPath](#js/task/Paths+containsPath)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**See**: [containsPath](#js/task/Paths+containsPath)  
<a name="js/task/Paths+remove"></a>

### js/task/Paths.remove()
Alias of [removePath](#js/task/Paths+removePath)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**See**: [removePath](#js/task/Paths+removePath)  
<a name="js/task/Paths+add"></a>

### js/task/Paths.add()
Alias of [appendToPath](#js/task/Paths+appendToPath)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**See**: [appendToPath](#js/task/Paths+appendToPath)  
<a name="js/task/Paths+appendTo"></a>

### js/task/Paths.appendTo()
Alias of [appendToPath](#js/task/Paths+appendToPath)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**See**: [appendToPath](#js/task/Paths+appendToPath)  
<a name="js/task/Paths+removeFrom"></a>

### js/task/Paths.removeFrom()
Alias of [removeFromPath](#js/task/Paths+removeFromPath)

**Kind**: instance method of <code>[js/task/Paths](#js/task/Paths)</code>  
**See**: [removeFromPath](#js/task/Paths+removeFromPath)  
<a name="js/task/Paths.DEFAULTS"></a>

### js/task/Paths.DEFAULTS : <code>Object</code>
The default values of options, when adding paths.

**Kind**: static constant of <code>[js/task/Paths](#js/task/Paths)</code>  

* [.DEFAULTS](#js/task/Paths.DEFAULTS) : <code>Object</code>
    * [.autoNormalizePath](#js/task/Paths.DEFAULTS.autoNormalizePath) : <code>boolean</code>
    * [.nameTokenPattern](#js/task/Paths.DEFAULTS.nameTokenPattern) : <code>RegExp</code>

<a name="js/task/Paths.DEFAULTS.autoNormalizePath"></a>

#### DEFAULTS.autoNormalizePath : <code>boolean</code>
Whether use path.normalize(...) on passed globs.

**Kind**: static property of <code>[DEFAULTS](#js/task/Paths.DEFAULTS)</code>  
**Default**: <code>true</code>  
<a name="js/task/Paths.DEFAULTS.nameTokenPattern"></a>

#### DEFAULTS.nameTokenPattern : <code>RegExp</code>
**Kind**: static property of <code>[DEFAULTS](#js/task/Paths.DEFAULTS)</code>  
**Default**: <code>\s*(&lt;[\s\-\\\/\.\*\w]+&gt;)\s* /i</code>  
**documentation generated on Thu, 26 May 2016 18:28:48 GMT**
