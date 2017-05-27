/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.Dictionary.create
 * @param {object|Array} [data]
 * @returns {$data.Dictionary}
 */

/**
 * Key-value container with string keys and any-type values.
 * **Pairs are not unique.**
 * @class $data.Dictionary
 * @extends $data.DataContainer
 * @mixes $data.KeyValueContainer
 */
exports.Dictionary = $oop.getClass('$data.Dictionary')
    .extend($oop.getClass('$data.DataContainer'))
    .include($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.Dictionary# */{
        /**
         * @memberOf $data.Dictionary
         * @type {string}
         * @constant
         */
        keyType: exports.KEY_TYPE_STRING,

        /**
         * @memberOf $data.Dictionary
         * @type {string}
         * @constant
         */
        valueType: exports.VALUE_TYPE_ANY,

        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.Dictionary}
         */
        setItem: function (key, value) {
            var data = this._data,
                values = data[key];

            if (values instanceof Array) {
                // current item is array
                // only when value doesn't exist
                // adding to array
                values.push(value);
            } else {
                // current item does not exist
                // setting as single value
                data[key] = [value];
            }

            // updating item count
            if (this._itemCount !== undefined) {
                this._itemCount++;
            }

            return this;
        },

        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.Dictionary}
         */
        deleteItem: function (key, value) {
            var data = this._data,
                values = data[key],
                valueIndex;

            if (values) {
                if (values.length === 1 && values[0] === value) {
                    // value is singular
                    delete data[key];

                    // updating value counter
                    if (this._itemCount !== undefined) {
                        this._itemCount--;
                    }
                } else {
                    valueIndex = values.indexOf(value);

                    if (valueIndex > -1) {
                        // value is present on specified key
                        // splicing out value from array
                        values.splice(valueIndex, 1);

                        // updating value counter
                        if (this._itemCount !== undefined) {
                            this._itemCount--;
                        }
                    }
                }
            }

            return this;
        },

        /**
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.Dictionary}
         */
        forEachItem: function (callback, context) {
            var data = this._data,
                keys = Object.keys(data),
                keyCount = keys.length,
                i, key, values, valueCount,
                j;

            loop:
            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                values = data[key];
                valueCount = values.length;
                for (j = 0; j < valueCount; j++) {
                    if (callback.call(context, values[j], key, this) === false) {
                        break loop;
                    }
                }
            }

            return this;
        }
    });

$oop.getClass('$data.DataContainer')
    .delegate(/** @lends $data.DataContainer# */{
        /**
         * @returns {$data.Dictionary}
         */
        toDictionary: function () {
            return exports.Dictionary.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.Dictionary}
     */
    toDictionary: function () {
        return exports.Dictionary.create(this);
    }
});
