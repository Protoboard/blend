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
 * @extends $data.Container
 * @implements $data.KeyValueContainer
 */
exports.Lookup = $oop.getClass('$data.Lookup')
    .extend($oop.getClass('$data.Container'))
    .implement($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.Lookup# */{
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
         * @param {string} key
         * @returns {*}
         */
        getValue: function (key) {
            return this._data[key];
        }
    });

$oop.getClass('$data.Container')
    .delegate(/** @lends $data.Container# */{
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
