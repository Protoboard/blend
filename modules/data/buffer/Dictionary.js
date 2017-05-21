/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.Dictionary.create
 * @param {object|Array} [data]
 * @returns {$data.Dictionary}
 */

/**
 * TODO: Implement rest of Iterable & Filterable
 * TODO: Add .inflate()
 * @class $data.Dictionary
 * @extends $data.Buffer
 * @implements $data.KeyValueContainer
 * @implements $data.Iterable
 * @implements $data.Filterable
 */
exports.Dictionary = $oop.getClass('$data.Dictionary')
    .extend($oop.getClass('$data.Buffer'))
    .implement($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.Dictionary# */{
        /**
         * @param {object|Array} [data]
         * @ignore
         */
        init: function (data) {
            /**
             * Tracks number of key-value pairs in the dictionary.
             * @type {number}
             * @protected
             */
            this._itemCount = data ? undefined : 0;
        },

        /**
         * @returns {number}
         * @private
         */
        _countItems: function () {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                result = 0,
                i, values;

            for (i = 0; i < keyCount; i++) {
                values = data[keys[i]];
                result += values instanceof Array ?
                    values.length :
                    1;
            }

            return result;
        },

        /**
         * @inheritDoc
         * @returns {$data.Dictionary}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._itemCount = this._itemCount;
            return cloned;
        },

        /**
         * @inheritDoc
         * @returns {$data.Dictionary}
         */
        clear: function () {
            this._itemCount = 0;
            return this;
        },

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
         * @param {object} items
         * @returns {$data.Dictionary}
         */
        setItems: function (items) {
            var keys = Object.keys(items),
                keyCount = keys.length,
                i, key, values, valueCount,
                j;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                values = items[key];

                if (values instanceof Array) {
                    valueCount = values.length;
                    for (j = 0; j < valueCount; j++) {
                        this.setItem(key, values[j]);
                    }
                } else {
                    this.setItem(key, values);
                }
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
         * @param {object} items
         * @returns {$data.Dictionary}
         */
        deleteItems: function (items) {
            var keys = Object.keys(items),
                keyCount = keys.length,
                i, key, values, valueCount,
                j;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                values = items[key];

                if (values instanceof Array) {
                    valueCount = values.length;
                    for (j = 0; j < valueCount; j++) {
                        this.deleteItem(key, values[j]);
                    }
                } else {
                    this.deleteItem(key, values);
                }
            }

            return this;
        },

        /**
         * @returns {number}
         */
        getItemCount: function () {
            var itemCount = this._itemCount;
            if (itemCount === undefined) {
                itemCount = this._itemCount = this._countItems();
            }
            return itemCount;
        },

        /**
         * @param {string} key
         * @returns {*}
         */
        getValue: function (key) {
            return this._data[key];
        },

        /**
         * @returns {string[]}
         */
        getKeys: function () {
            return Object.keys(this._data);
        },

        /**
         * @returns {Array}
         */
        getValues: function () {
            var data = this._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key, values, valueCount,
                j,
                result = [];

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                values = data[key];
                valueCount = values.length;
                if (values instanceof Array) {
                    for (j = 0; j < valueCount; j++) {
                        result.push(values[j]);
                    }
                } else {
                    result.push(values);
                }
            }

            this._itemCount = result.length;

            return result;
        },

        /**
         * @returns {string}
         */
        getFirstKey: function () {
            var data = this._data,
                key;
            for (key in data) {
                if (hOP.call(data, key)) {
                    return key;
                }
            }
        },

        /**
         * @returns {*}
         */
        getFirstValue: function () {
            var data = this._data,
                key, values;
            for (key in data) {
                if (hOP.call(data, key)) {
                    values = data[key];
                    return values instanceof Array ?
                        values[0] :
                        values;
                }
            }
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

$oop.getClass('$data.Buffer')
    .define(/** @lends $data.Buffer# */{
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
