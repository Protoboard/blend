/* globals $assert, $data, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.Collection.create
 * @param {object|Array} [data]
 * @returns {$data.Collection}
 */

/**
 * Key-value container with string keys and any-type values.
 * Pairs are unique.
 * @class $data.Collection
 * @extends $data.DataContainer
 * @mixes $data.KeyValueContainer
 * @mixes $data.StringKeyHost
 */
$data.Collection = $oop.getClass('$data.Collection')
    .extend($oop.getClass('$data.DataContainer'))
    .include($oop.getClass('$data.KeyValueContainer'))
    .include($oop.getClass('$data.StringKeyHost'))
    .define(/** @lends $data.Collection# */{
        /**
         * @type {string}
         * @constant
         */
        keyMultiplicity: $data.KEY_MUL_UNIQUE,

        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.Collection}
         */
        setItem: function (key, value) {
            var data = this._data,
                hasKey = hOP.call(data, key);

            data[key] = value;

            if (!hasKey && this._itemCount !== undefined) {
                this._itemCount++;
            }

            return this;
        },

        /**
         * @param {string} key
         * @param {*} [value]
         * @returns {$data.Collection}
         */
        deleteItem: function (key, value) {
            var data = this._data,
                hasValue = value === undefined ?
                    hOP.call(data, key) :
                    data[key] === value;

            if (hasValue) {
                delete data[key];

                if (this._itemCount !== undefined) {
                    this._itemCount--;
                }
            }

            return this;
        },

        /**
         * @inheritDoc
         * @param {function} callback Function to be called for each item
         * @param {object} [context] Context for callback
         * @returns {$data.Collection} Current instance
         */
        forEachItem: function (callback, context) {
            var data = this._data,
                keys = Object.keys(data),
                keyCount = keys.length,
                i, key;

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (callback && callback.call(context || this, data[key], key) === false) {
                    break;
                }
            }

            return this;
        },

        /**
         * @param {string} key
         * @returns {Array}
         */
        getValuesForKey: function (key) {
            var data = this._data;
            return hOP.call(data, key) ?
                [data[key]] :
                [];
        },

        /**
         * @param {string} key
         * @returns {*}
         */
        getValue: function (key) {
            return this._data[key];
        }
    });

$oop.getClass('$data.DataContainer')
    .delegate(/** @lends $data.DataContainer# */{
        /**
         * @returns {$data.Collection}
         */
        toCollection: function () {
            return $data.Collection.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.Collection}
     */
    toCollection: function () {
        return $data.Collection.create(this);
    }
});
