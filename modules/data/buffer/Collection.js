/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.Collection.create
 * @param {object|Array} [data]
 * @returns {$data.Collection}
 */

/**
 * Manipulates key-value stores.
 * @class $data.Collection
 * @extends $data.KeyValueStore
 */
exports.Collection = $oop.getClass('$data.Collection')
    .extend($oop.getClass('$data.KeyValueStore'))
    .define(/** @lends $data.Collection# */{
        /**
         * Merges current collection with specified collection and returns
         * result as a new collection. The specified collection's items
         * take precedence on collision.
         * @param {$data.Collection} collection Collection to merge with
         * @returns {$data.Collection} The merged collection
         */
        mergeWith: function (collection) {
            return this.clone()
                .setValues(collection._data);
        },

        /**
         * Merges specified collection into current collection.
         * The specified collection's items take precedence on collision.
         * Mutates current collection!
         * @param {$data.Collection} collection Collection to merge into
         * current one
         * @returns {$data.Collection} Current instance
         */
        mergeIn: function (collection) {
            this.setValues(collection._data);
            return this;
        },

        /**
         * Extracts items matching the specified keys and returns result
         * as a new collection.
         * @param {string[]|number[]} keys Key strings to be matched
         * @returns {$data.Collection} Filtered collection
         */
        filterByKeys: function (keys) {
            var data = this._data,
                keyCount = keys.length,
                i, key,
                result = data instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (hOP.call(data, key)) {
                    result[key] = data[key];
                }
            }

            return $oop.getClass(this.__classId).create(result);
        },

        /**
         * Extracts items matching the specified key prefix and
         * returns result as a new collection.
         * @param {string} prefix Key prefix to be matched
         * @returns {$data.Collection} Filtered collection
         */
        filterByKeyPrefix: function (prefix) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                prefixLength = prefix.length,
                i, key,
                result = data instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (key.slice(0, prefixLength) === prefix) {
                    result[key] = data[key];
                }
            }

            return $oop.getClass(this.__classId).create(result);
        },

        /**
         * Extracts items matching the specified value prefix and
         * returns result as a new collection.
         * TODO: Move to StringCollection.
         * @param {string} prefix Value prefix to be matched
         * @returns {$data.Collection} Filtered collection
         */
        filterByPrefix: function (prefix) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                prefixLength = prefix.length,
                i, key, value,
                result = data instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                value = data[key];
                if (value.slice(0, prefixLength) === prefix) {
                    result[key] = value;
                }
            }

            return $oop.getClass(this.__classId).create(result);
        },

        /**
         * Extracts items matching the specified key regular expression and
         * returns result as a new collection.
         * @param {RegExp} regExp Regular expression to be matched by keys
         * @returns {$data.Collection} Filtered collection
         */
        filterByKeyRegExp: function (regExp) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key,
                result = data instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (regExp.test(key)) {
                    result[key] = data[key];
                }
            }

            return $oop.getClass(this.__classId).create(result);
        },

        /**
         * Extracts items matching the specified value regexp and
         * returns result as a new collection.
         * TODO: Move to StringCollection.
         * @param {RegExp} regExp Regular expression to be matched by values
         * @returns {$data.Collection} Filtered collection
         */
        filterByRegExp: function (regExp) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key, value,
                result = data instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                value = data[key];
                if (regExp.test(value)) {
                    result[key] = value;
                }
            }

            return $oop.getClass(this.__classId).create(result);
        },

        /**
         * Extracts items matching the specified value type and
         * returns result as a new collection.
         * TODO: Allow repeating arguments.
         * @param {string|function|Object|$oop.Class} type Describes type
         * to be matched by item values. When string, `filterByType` will
         * check using `typeof` operator, when function, `instanceof`,
         * when object, `.isPrototypeOf()`, when a class, `.isIncludedBy()`.
         * @returns {$data.Collection} Filtered collection
         */
        filterByType: function (type) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key, value,
                result = data instanceof Array ? [] : {};

            switch (true) {
            case typeof type === 'string':
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    value = data[key];
                    if (typeof value === type) {
                        result[key] = value;
                    }
                }
                break;

            case typeof type === 'function':
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    value = data[key];
                    if (value instanceof type) {
                        result[key] = value;
                    }
                }
                break;

            case $oop.Class.isPrototypeOf(type):
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    value = data[key];
                    if (type.isIncludedBy(value)) {
                        result[key] = value;
                    }
                }
                break;

            case typeof type === 'object':
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    value = data[key];
                    if (type.isPrototypeOf(value)) {
                        result[key] = value;
                    }
                }
                break;
            }

            return $oop.getClass(this.__classId).create(result);
        },

        /**
         * Extracts items matching the condition in the specified
         * callback function and returns the result as a new collection.
         * @param {function} callback Filter function returning a boolean
         * @param {object} [context] Context for callback
         * @returns {$data.Collection} Filtered collection
         */
        filterBy: function (callback, context) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key, value,
                result = data instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                value = data[key];
                if (callback.call(context, value, key, this)) {
                    result[key] = value;
                }
            }

            return $oop.getClass(this.__classId).create(result);
        },

        /**
         * Iterates over collection and calls specified callback on
         * each item. Item order is not deterministic. Returns self.
         * Returning false from callback breaks iteration.
         * @param {function} callback Function to be called for each item
         * @param {object} [context] Context for callback
         * @returns {$data.Collection} Current instance
         */
        forEachItem: function (callback, context) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (callback.call(context, data[key], key, this) === false) {
                    break;
                }
            }

            return this;
        },

        /**
         * Maps collection values using the specified callback and
         * returns mapped key-value pairs as a new collection.
         * @param {function} callback Returns new value based on current item
         * @param {object} [context] Context for callback
         * @returns {$data.Collection} Mapped collection
         */
        mapValues: function (callback, context) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key,
                result = data instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                result[key] = callback.call(context, data[key], key, this);
            }

            // returning vanilla collection
            return exports.Collection.create(result);
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
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key,
                result = initialValue;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                result = callback.call(context, result, data[key], key, this);
            }

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
         * @returns {$data.Collection} Mapped collection
         */
        passEachValueTo: function (callback, context, argIndex, arg) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key,
                args,
                result = data instanceof Array ? [] : {};

            if (arguments.length > 3) {
                // there are additional arguments
                // splicing in placeholder for item value
                args = slice.call(arguments, 3);
                args.splice(argIndex, 0, null);
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    args[argIndex] = data[key];
                    result[key] = callback.apply(context, args);
                }
            } else {
                // no additional arguments
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    result[key] = callback.call(context, data[key]);
                }
            }

            // returning vanilla collection
            return exports.Collection.create(result);
        },

        /**
         * Calls the specified method on all item values, and returns
         * mapped key-value pairs as a new collection.
         * TODO: Move to ObjectCollection?
         * @param {string} methodName Identifies method on item values
         * @param {...*} [arg] Rest of arguments to be passed to callback.
         * Item value will be spliced in at given index.
         * @returns {$data.Collection} Mapped collection
         */
        callOnEachItem: function (methodName, arg) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key, value,
                args,
                result = data instanceof Array ? [] : {};

            if (arguments.length > 1) {
                args = slice.call(arguments, 1);
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    value = data[key];
                    result[key] = value[methodName].apply(value, args);
                }
            } else {
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    result[key] = data[key][methodName]();
                }
            }

            // returning vanilla collection
            return exports.Collection.create(result);
        },

        /**
         * Creates a new instance of the specified class, passing each item
         * value as one of the constructor arguments.
         * @param {$oop.Class} Class Class to create new instances of
         * @param {number} [argIndex] Index of item value among ctr arguments
         * @param {...*} [arg] Rest of arguments to be passed to callback.
         * Item value will be spliced in at given index.
         * @returns {$data.Collection} Mapped collection
         */
        createWithEachValue: function (Class, argIndex, arg) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key,
                args,
                result = data instanceof Array ? [] : {};

            if (arguments.length > 2) {
                // there are additional arguments
                // splicing in placeholder for item value
                args = slice.call(arguments, 2);
                args.splice(argIndex, 0, null);
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    args[argIndex] = data[key];
                    result[key] = Class.create.apply(Class, args);
                }
            } else {
                // no additional arguments
                for (i = 0; i < keyCount; i++) {
                    key = keys[i];
                    result[key] = Class.create(data[key]);
                }
            }

            // returning vanilla collection
            return exports.Collection.create(result);
        }
    });

$oop.getClass('$data.Buffer')
    .define(/** @lends $data.Buffer# */{
        /**
         * @returns {$data.Collection}
         */
        toCollection: function () {
            return exports.Collection.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.Collection}
     */
    toCollection: function () {
        return exports.Collection.create(this);
    }
});
