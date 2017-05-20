/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.KeyValueStore.create
 * @param {object|Array} [data]
 * @returns {$data.KeyValueStore}
 */

/**
 * @class $data.KeyValueStore
 * @extends $data.Buffer
 */
exports.KeyValueStore = $oop.getClass('$data.KeyValueStore')
    .extend($oop.getClass('$data.Buffer'))
    .define(/** @lends $data.KeyValueStore# */{
        /**
         * @param {object|Array} [data]
         * @ignore
         */
        init: function (data) {
            /**
             * Keeps track of number of keys in store.
             * @protected
             */
            this._keyCount = data ? undefined : 0;
        },

        /**
         * @inheritDoc
         * @returns {$data.KeyValueStore}
         */
        clone: function clone() {
            var cloned = clone.returned;
            cloned._keyCount = this._keyCount;
            return cloned;
        },

        /**
         * @inheritDoc
         * @returns {$data.KeyValueStore}
         */
        clear: function () {
            this._keyCount = 0;
            return this;
        },

        /**
         * @returns {Number}
         */
        getKeyCount: function () {
            var keyCount = this._keyCount;
            if (keyCount === undefined) {
                keyCount = this._keyCount = Object.keys(this._data).length;
            }
            return keyCount;
        },

        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.KeyValueStore}
         */
        setValue: function (key, value) {
            var data = this._data,
                hasKey = hOP.call(data, key);

            data[key] = value;

            if (!hasKey && this._keyCount !== undefined) {
                this._keyCount++;
            }

            return this;
        },

        /**
         * @param {object} keyValuePairs
         * @returns {$data.KeyValueStore}
         */
        setValues: function (keyValuePairs) {
            var keys = Object.keys(keyValuePairs),
                keyCount = keys.length,
                i, key;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                this.setValue(key, keyValuePairs[key]);
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
         * @param {string} key
         * @returns {$data.KeyValueStore}
         */
        deleteKey: function (key) {
            var data = this._data,
                hasKey = hOP.call(data, key);

            if (hasKey) {
                delete data[key];

                if (this._keyCount !== undefined) {
                    this._keyCount--;
                }
            }

            return this;
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
            return undefined;
        }
    });

$oop.getClass('$data.Buffer')
    .define(/** @lends $data.Buffer# */{
        /**
         * @returns {$data.KeyValueStore}
         */
        toKeyValueStore: function () {
            return exports.KeyValueStore.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.KeyValueStore}
     */
    toKeyValueStore: function () {
        return exports.KeyValueStore.create(this);
    }
});
