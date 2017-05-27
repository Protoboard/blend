/* globals $assert, $oop, $utils, slice */
"use strict";

/**
 * @mixin $data.KeyValueContainer
 * @augments $data.DataContainer
 */
exports.KeyValueContainer = $oop.getClass('$data.KeyValueContainer')
    .require($oop.getClass('$data.DataContainer'))
    .define(/** @lends $data.KeyValueContainer# */{
        /**
         * @type {string}
         * @constant
         */
        keyType: undefined,

        /**
         * @type {string}
         * @constant
         */
        valueType: undefined,

        /**
         * @param {object|Array} data
         * @ignore
         */
        init: function (data) {
            /**
             * @type {number}
             */
            this._itemCount = data ? undefined : 0;
        },

        /**
         * Clones current instance.
         * @returns {$data.KeyValueContainer}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._itemCount = this._itemCount;
            return cloned;
        },

        /**
         * Resets state of current instance.
         * @returns {$data.KeyValueContainer}
         */
        clear: function () {
            this._itemCount = 0;
            return this;
        },

        /**
         * Sets a key-value pair in the container.
         * @method $data.KeyValueContainer#setItem
         * @param {string} key
         * @param {*} value
         * @returns {$data.KeyValueContainer}
         * @abstract
         */

        /**
         * Deletes key-value pair from container.
         * @method $data.KeyValueContainer#deleteItem
         * @param {string} key
         * @param {*} [value]
         * @returns {$data.KeyValueContainer}
         * @abstract
         */

        /**
         * Retrieves value(s) for the specified key.
         * @method $data.KeyValueContainer#getValue
         * @param {string} key
         * @returns {*}
         * @abstract
         */

        /**
         * @method $data.KeyValueContainer#forEachItem
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.KeyValueContainer}
         * @abstract
         */

        /**
         * Retrieves the number of key-value pairs in the container.
         * @returns {Number}
         */
        getItemCount: function () {
            var itemCount = this._itemCount;
            if (itemCount === undefined) {
                itemCount = 0;
                this.forEachItem(function () {
                    itemCount++;
                });
                this._itemCount = itemCount;
            }
            return itemCount;
        },

        /**
         * Retrieves a list of all keys in the container.
         * Result might contain duplicates, depending on host class.
         * TODO: Should return DataContainer based on key type
         * @returns {Array}
         */
        getKeys: function () {
            var result = [];
            this.forEachItem(function (value, key) {
                result.push(key);
            });
            return result;
        },

        /**
         * Retrieves a list of all values in the container.
         * Result might contain duplicates, depending on host class.
         * TODO: Should return DataContainer based on value type
         * @returns {Array}
         */
        getValues: function () {
            var result = [];
            this.forEachItem(function (value) {
                result.push(value);
            });
            return result;
        },

        /**
         * @returns {*}
         */
        getFirstKey: function () {
            var result;
            this.forEachItem(function (value, key) {
                result = key;
                return false;
            });
            return result;
        },

        /**
         * @returns {*}
         */
        getFirstValue: function () {
            var result;
            this.forEachItem(function (value) {
                result = value;
                return false;
            });
            return result;
        },

        /**
         * Converts current DataContainer to the specified class.
         * @param {$data.KeyValueContainer} KeyValueContainer
         * @returns {$data.KeyValueContainer}
         */
        toType: function (KeyValueContainer) {
            var result = KeyValueContainer.create();
            this.forEachItem(function (value, key) {
                result.setItem(key, value);
            });
            return result;
        },

        /**
         * Maps collection values using the specified callback and
         * returns mapped key-value pairs as a new collection.
         * TODO: Pass in result value type?
         * @param {function} callback Returns new value based on current item
         * @param {object} [context] Context for callback
         * @returns {$data.Collection} Mapped collection
         */
        mapValues: function (callback, context) {
            var data = this._data instanceof Array ? [] : {},
                ResultClass = exports.getMapResultClass(this, 'VALUE', 'ANY'),
                result = ResultClass.create(data);

            this.forEachItem(function (value, key, iterable) {
                value = callback.call(this, value, key, iterable);
                result.setItem(key, value);
            }, context);

            return result;
        },

        /**
         * Maps collection keys using the specified callback and
         * returns mapped key-value pairs as a new collection.
         * TODO: Pass in result value type?
         * @param {function} callback Returns new value based on current item
         * @param {object} [context] Context for callback
         * @returns {$data.Collection} Mapped collection
         */
        mapKeys: function (callback, context) {
            var ResultClass = exports.getMapResultClass(this, 'KEY', 'ANY'),
                result = ResultClass.create();

            this.forEachItem(function (value, key, iterable) {
                key = callback.call(this, value, key, iterable);
                result.setItem(value, key);
            }, context);

            return result;
        },

        /**
         * Accumulates a value based on the contribution of each item,
         * as defined by the specified callback.
         * @param {function} callback Contributes to accumulated value
         * based on current item
         * @param {*} [initialValue] Initial value for accumulated result
         * @param {object} [context] Context for callback
         * @returns {*} Accummulated value
         */
        reduce: function (callback, initialValue, context) {
            var result = initialValue;

            this.forEachItem(function (value, key, iterable) {
                result = callback.call(context, result, value, key, iterable);
            }, context);

            return result;
        },

        /**
         * Passes each item value to the specified callback as one of
         * its arguments, and returns mapped key-value pairs as a
         * new collection.
         * @param {function} callback Returns new value based on arguments
         * @param {object} [context] Context for callback
         * @param {number} [argIndex=0] Index of item value among arguments
         * @param {...*} [arg] Rest of arguments to be passed to callback.
         * Item value will be spliced in at given index.
         * @returns {$data.KeyValueContainer} Mapped collection
         */
        passEachValueTo: function (callback, context, argIndex, arg) {
            var args;

            if (arguments.length > 3) {
                // there are additional arguments
                // splicing in placeholder for item value
                args = slice.call(arguments, 3);
                args.splice(argIndex, 0, null);
                return this.mapValues(function (value) {
                    args[argIndex] = value;
                    return callback.apply(this, args);
                }, context);
            } else {
                // no additional arguments
                return this.mapValues(function (value) {
                    return callback.call(this, value);
                }, context);
            }
        },

        /**
         * Calls the specified method on all item values, and returns
         * mapped key-value pairs as a new collection.
         * @param {string} methodName Identifies method on item values
         * @param {...*} [arg] Rest of arguments to be passed to callback.
         * Item value will be spliced in at given index.
         * @returns {$data.KeyValueContainer} Mapped collection
         */
        callOnEachValue: function (methodName, arg) {
            var args;

            if (arguments.length > 1) {
                args = slice.call(arguments, 1);
                return this.mapValues(function (value) {
                    return value[methodName].apply(value, args);
                });
            } else {
                return this.mapValues(function (value) {
                    return value[methodName]();
                });
            }
        },

        /**
         * Creates a new instance of the specified class, passing each item
         * value as one of the constructor arguments.
         * @param {$oop.Class} Class Class to create new instances of
         * @param {number} [argIndex] Index of item value among ctr arguments
         * @param {...*} [arg] Rest of arguments to be passed to callback.
         * Item value will be spliced in at given index.
         * @returns {$data.KeyValueContainer} Mapped collection
         */
        createWithEachValue: function (Class, argIndex, arg) {
            var args;

            if (arguments.length > 2) {
                // there are additional arguments
                // splicing in placeholder for item value
                args = slice.call(arguments, 2);
                args.splice(argIndex, 0, null);
                return this.mapValues(function (value) {
                    args[argIndex] = value;
                    return Class.create.apply(Class, args);
                });
            } else {
                // no additional arguments
                return this.mapValues(function (value) {
                    return Class.create(value);
                });
            }
        },

        /**
         * Extracts items matching the condition in the specified
         * callback function and returns the result as a new collection.
         * @param {function} callback Filter function returning a boolean
         * @param {object} [context] Context for callback
         * @returns {$data.KeyValueContainer} Filtered collection
         */
        filterBy: function (callback, context) {
            var data = this._data instanceof Array ? [] : {},
                ResultClass = exports.getMapResultClass(this, 'VALUE', 'ANY'),
                result = ResultClass.create(data);

            this.forEachItem(function (value, key, iterable) {
                if (callback.call(this, value, key, iterable)) {
                    result.setItem(key, value);
                }
            }, context);

            return result;
        },

        /**
         * Extracts items matching the specified keys and returns result
         * as a new collection.
         * TODO: Blocked by KeyValueContainer#getValues and/or #joinTo
         * TODO: Necessary? Use joining to a symmetric collection instead.
         * @param {string[]|number[]} keys Key strings to be matched
         * @returns {$data.KeyValueContainer}
         */
        filterByKeys: function (keys) {

        },

        /**
         * Extracts items matching the specified key prefix and
         * returns result as a new collection.
         * @param {string} prefix Key prefix to be matched
         * @returns {$data.KeyValueContainer} Filtered collection
         */
        filterByKeyPrefix: function (prefix) {
            var prefixLength = prefix.length;
            return this.filterBy(function (value, key) {
                return key.slice(0, prefixLength) === prefix;
            });
        },

        /**
         * @param {string} prefix
         * @returns {$data.KeyValueContainer}
         */
        filterByPrefix: function (prefix) {
            var prefixLength = prefix.length;
            return this.filterBy(function (value) {
                return value.slice(0, prefixLength) === prefix;
            });
        },

        /**
         * Extracts items matching the specified key regular expression and
         * returns result as a new collection.
         * @param {RegExp} regExp Regular expression to be matched by keys
         * @returns {$data.KeyValueContainer} Filtered collection
         */
        filterByKeyRegExp: function (regExp) {
            return this.filterBy(function (value, key) {
                return regExp.test(key);
            });
        },

        /**
         * @param {RegExp} regExp
         * @returns {$data.KeyValueContainer}
         */
        filterByRegExp: function (regExp) {
            return this.filterBy(function (value) {
                return regExp.test(value);
            });
        },

        /**
         * Extracts items matching the specified value type and
         * returns result as a new collection.
         * TODO: Allow repeating arguments.
         * @param {string|function|Object|$oop.Class} type Describes type
         * to be matched by item values. When string, `filterByType` will
         * check using `typeof` operator, when function, `instanceof`,
         * when object, `.isPrototypeOf()`, when a class, `.isIncludedBy()`.
         * @returns {$data.KeyValueContainer} Filtered collection
         */
        filterByType: function (type) {
            switch (true) {
            case typeof type === 'string':
                return this.filterBy(function (value) {
                    return typeof value === type;
                });

            case typeof type === 'function':
                return this.filterBy(function (value) {
                    return value instanceof type;
                });

            case $oop.Class.isPrototypeOf(type):
                return this.filterBy(function (value) {
                    return type.isIncludedBy(value);
                });

            case typeof type === 'object':
                return this.filterBy(function (value) {
                    return type.isPrototypeOf(value);
                });
            }
        }
    });

$oop.copyProperties(exports, /** @lends $data */{
    /** @constant */
    KEY_TYPE_STRING: 'KEY_TYPE_STRING',

    /** @constant */
    KEY_TYPE_ANY: 'KEY_TYPE_ANY',

    /** @constant */
    VALUE_TYPE_STRING: 'VALUE_TYPE_STRING',

    /** @constant */
    VALUE_TYPE_ANY: 'VALUE_TYPE_ANY'
});
