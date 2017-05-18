/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.Collection.create
 * @param {object|Array} [data]
 * @returns {$data.Collection}
 */

/**
 * @class $data.Collection
 * @extends $data.KeyValueStore
 */
exports.Collection = $oop.getClass('$data.Collection')
    .extend($oop.getClass('$data.KeyValueStore'))
    .define(/** @lends $data.Collection# */{
        /**
         * @param {$data.Collection} collection
         * @returns {$data.Collection}
         */
        mergeWith: function (collection) {
            return this.clone()
                .setValues(collection._data);
        },

        /**
         * @param {$data.Collection} collection
         * @returns {$data.Collection}
         */
        mergeIn: function (collection) {
            this.setValues(collection._data);
            return this;
        },

        /**
         * @param {string[]|number[]} keys
         * @returns {$data.Collection}
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
         * @param {string} prefix
         * @returns {$data.Collection}
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
         * @param {string} prefix
         * @returns {$data.Collection}
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
         * @param {RegExp} regExp
         * @returns {$data.Collection}
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
         * @param {RegExp} regExp
         * @returns {$data.Collection}
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
         * TODO: Allow repeating arguments.
         * @param {string|function|Object|$oop.Class} type
         * @returns {$data.Collection}
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
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.Collection}
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
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.Collection}
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
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.Collection}
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
         * @param {function} callback
         * @param {*} [initialValue]
         * @param {object} [context]
         * @returns {*}
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
         * @param {function} callback
         * @param {object} [context]
         * @param {number} [argIndex=0]
         * @param {...*} [arg]
         * @returns {$data.Collection}
         */
        passEachItemTo: function (callback, context, argIndex, arg) {
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
         * @param {string} methodName
         * @param {...*} [arg]
         * @returns {result}
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
         * @param {$oop.Class} Class
         * @param {number} [argIndex]
         * @param {...*} [arg]
         * @returns {$data.Collection}
         */
        createWithEachItem: function (Class, argIndex, arg) {
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

/** @external Array */
$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.Collection}
     */
    toCollection: function () {
        return exports.Collection.create(this);
    }
});
