/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.StringDictionary.create
 * @param {object|Array} [data]
 * @returns {$data.StringDictionary}
 */

/**
 * Key-value container with string keys and string values.
 * Pairs are unique.
 * @class $data.StringDictionary
 * @extends $data.DataContainer
 * @mixes $data.KeyValueContainer
 */
exports.StringDictionary = $oop.getClass('$data.StringDictionary')
    .extend($oop.getClass('$data.DataContainer'))
    .include($oop.getClass('$data.KeyValueContainer'))
    .include($oop.getClass('$data.StringKeyHost'))
    .include($oop.getClass('$data.StringValueHost'))
    .define(/** @lends $data.StringDictionary# */{
        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.StringDictionary}
         */
        setItem: function (key, value) {
            var data = this._data,
                values = data[key];

            if (values instanceof Object) {
                // current item is array
                // only when value doesn't exist
                // adding to array
                if (!hOP.call(values, value)) {
                    values[value] = 1;

                    // updating item count
                    if (this._itemCount !== undefined) {
                        this._itemCount++;
                    }
                }
            } else {
                // current item does not exist
                // setting as single value
                values = {};
                values[value] = 1;
                data[key] = values;

                // updating item count
                if (this._itemCount !== undefined) {
                    this._itemCount++;
                }
            }

            return this;
        },

        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.StringDictionary}
         */
        deleteItem: function (key, value) {
            var data = this._data,
                values = data[key];

            if (values && hOP.call(values, value)) {
                delete values[value];

                if (exports.isEmptyObject(values)) {
                    delete data[key];
                }

                // updating value counter
                if (this._itemCount !== undefined) {
                    this._itemCount--;
                }
            }

            return this;
        },

        /**
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.StringDictionary}
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
                    values = Object.keys(data[key]);
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
         * @returns {$data.StringDictionary}
         */
        toStringDictionary: function () {
            return exports.StringDictionary.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.StringDictionary}
     */
    toStringDictionary: function () {
        return exports.StringDictionary.create(this);
    }
});
