/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.Lookup.create
 * @param {object|Array} [data]
 * @returns {$data.Lookup}
 */

/**
 * 1 to 1 key-value store.
 * TODO: Merge into Collection?
 * @class $data.Lookup
 * @extends $data.Buffer
 * @implements $data.KeyValueContainer
 */
exports.Lookup = $oop.getClass('$data.Lookup')
    .extend($oop.getClass('$data.Buffer'))
    .implement($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.Lookup# */{
        /**
         * @param {object|Array} [data]
         * @ignore
         */
        init: function (data) {
            /**
             * Keeps track of number of keys in store.
             * @type {number}
             * @protected
             */
            this._keyCount = data ? undefined : 0;
        },

        /**
         * @inheritDoc
         * @returns {$data.Lookup}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._keyCount = this._keyCount;
            return cloned;
        },

        /**
         * @inheritDoc
         * @returns {$data.Lookup}
         */
        clear: function () {
            this._keyCount = 0;
            return this;
        },

        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.Lookup}
         */
        setItem: function (key, value) {
            var data = this._data,
                hasKey = hOP.call(data, key);

            data[key] = value;

            if (!hasKey && this._keyCount !== undefined) {
                this._keyCount++;
            }

            return this;
        },

        /**
         * @param {object} items
         * @returns {$data.Lookup}
         */
        setItems: function (items) {
            var keys = Object.keys(items),
                keyCount = keys.length,
                i, key;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                this.setItem(key, items[key]);
            }

            return this;
        },

        /**
         * @param {string} key
         * @param {*} [value]
         * @returns {$data.Lookup}
         */
        deleteItem: function (key, value) {
            var data = this._data,
                hasValue = value === undefined ?
                    hOP.call(data, key) :
                    data[key] === value;

            if (hasValue) {
                delete data[key];

                if (this._keyCount !== undefined) {
                    this._keyCount--;
                }
            }

            return this;
        },

        /**
         * @param {object} items
         * @returns {$data.Lookup}
         */
        deleteItems: function (items) {
            var keys = Object.keys(items),
                keyCount = keys.length,
                i, key;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                this.deleteItem(key, items[key]);
            }

            return this;
        },

        /**
         * @returns {Number}
         */
        getItemCount: function () {
            var keyCount = this._keyCount;
            if (keyCount === undefined) {
                keyCount = this._keyCount = Object.keys(this._data).length;
            }
            return keyCount;
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
            var keys = Object.keys(this._data);
            if (this._keyCount === undefined) {
                this._keyCount = keys.length;
            }
            return keys;
        },

        /**
         * @returns {Array}
         */
        getValues: function () {
            var data = this._data,
                keys = Object.keys(data),
                keyCount = keys.length,
                i,
                result = new Array(keyCount);

            for (i = 0; i < keyCount; i++) {
                result[i] = data[keys[i]];
            }

            if (this._keyCount === undefined) {
                this._keyCount = keyCount;
            }

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
                key;
            for (key in data) {
                if (hOP.call(data, key)) {
                    return data[key];
                }
            }
        }
    });

$oop.getClass('$data.Buffer')
    .delegate(/** @lends $data.Buffer# */{
        /**
         * @returns {$data.Lookup}
         */
        toLookup: function () {
            return exports.Lookup.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.Lookup}
     */
    toLookup: function () {
        return exports.Lookup.create(this);
    }
});
