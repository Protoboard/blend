/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.Dictionary.create
 * @param {object|Array} [data]
 * @returns {$data.Dictionary}
 */

/**
 * Many to many key-value store, with string keys.
 * Fast key lookups and joins.
 * @class $data.Dictionary
 * @extends $data.Container
 * @implements $data.ItemContainer
 * @mixes $data.Iterable
 */
exports.Dictionary = $oop.getClass('$data.Dictionary')
    .extend($oop.getClass('$data.Container'))
    .implement($oop.getClass('$data.ItemContainer'))
    .define(/** @lends $data.Dictionary# */{
        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.Dictionary}
         */
        setItem: function (key, value) {
            var data = this._data,
                values = data[key],
                valueIndex;

            switch (true) {
            case !hOP.call(data, key):
                // current item does not exist
                // setting as single value
                data[key] = value;

                // updating item count
                if (this._itemCount !== undefined) {
                    this._itemCount++;
                }
                break;

            case values instanceof Array:
                // current item is array
                valueIndex = values.indexOf(value);
                if (valueIndex === -1) {
                    // only when value doesn't exist
                    // adding to array
                    values.push(value);

                    // updating item count
                    if (this._itemCount !== undefined) {
                        this._itemCount++;
                    }
                }
                break;

            case values !== value:
                // current item is single value
                // turning into array
                data[key] = [values, value];

                // updating item count
                if (this._itemCount !== undefined) {
                    this._itemCount++;
                }
                break;
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

            switch (true) {
            case values instanceof Array:
                valueIndex = values.indexOf(value);
                if (valueIndex > -1) {
                    // value is present on specified key
                    // splicing out value from array
                    values.splice(valueIndex, 1);

                    if (values.length === 1) {
                        // replacing array with remaining single value
                        data[key] = values[0];
                    }

                    // updating value counter
                    if (this._itemCount !== undefined) {
                        this._itemCount--;
                    }
                }
                break;

            case values === value:
                // removing full item
                delete data[key];

                // updating counters
                if (this._itemCount !== undefined) {
                    this._itemCount--;
                }
                break;
            }

            return this;
        },

        /**
         * @param {string} key
         * @returns {*}
         */
        getValue: function (key) {
            return this._data[key];
        },

        /**
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.Dictionary}
         */
        forEachItem: function (callback, context) {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key, values, valueCount,
                j;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                values = data[key];
                if (values instanceof Array) {
                    valueCount = values.length;
                    for (j = 0; j < valueCount; j++) {
                        if (callback.call(context, values[j], key, j, this) === false) {
                            break;
                        }
                    }
                } else {
                    if (callback.call(context, values, key, undefined, this) === false) {
                        break;
                    }
                }
            }

            return this;
        }
    });

$oop.getClass('$data.Container')
    .delegate(/** @lends $data.Container# */{
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
