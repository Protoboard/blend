/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.Set.create
 * @param {object|Array} [data]
 * @returns {$data.Set}
 */

/**
 *
 * @class $data.Set
 * @extends $data.Collection
 */
exports.Set = $oop.getClass('$data.Set')
    .extend($oop.getClass('$data.Collection'))
    .define(/** @lends $data.Set# */{
        /**
         * Intersects current set with specified set and returns the result
         * as a new set.
         * @param {$data.Set} set Set to intersect current set with
         * @returns {$data.Set} Intersection
         */
        intersectWith: function (set) {
            var localData = this._data,
                remoteData = set._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key,
                result = localData instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (hOP.call(remoteData, key)) {
                    result[key] = localData[key];
                }
            }

            return this.getClass(this.__classId).create(result);
        },

        /**
         * Unites current set with specified set and returns the result
         * as a new set.
         * @param {$data.Set} set Set to unite current set with
         * @returns {$data.Set} Union
         */
        uniteWith: function (set) {
            var localData = this._data,
                localKeys = this.getKeys(),
                localKeyCount = localKeys.length,
                remoteData = set._data,
                remoteKeys = set.getKeys(),
                remoteKeyCount = remoteKeys.length,
                i, key,
                result = localData instanceof Array ? [] : {};

            for (i = 0; i < remoteKeyCount; i++) {
                key = remoteKeys[i];
                result[key] = remoteData[key];
            }

            for (i = 0; i < localKeyCount; i++) {
                key = localKeys[i];
                result[key] = localData[key];
            }

            return this.getClass(this.__classId).create(result);
        },

        /**
         * Subtracts specified set from current set and returns difference
         * as a new set.
         * @param {$data.Set} set Set to subtract from current set
         * @returns {$data.Set} Difference
         */
        subtract: function (set) {
            var localData = this._data,
                remoteData = set._data,
                keys = this.getKeys(),
                keyCount = keys.length,
                i, key,
                result = localData instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (!hOP.call(remoteData, key)) {
                    result[key] = localData[key];
                }
            }

            return this.getClass(this.__classId).create(result);
        },

        /**
         * Subtracts current set from specified set and returns difference
         * as a new set.
         * @param {$data.Set} set Set to subtract current set from
         * @returns {$data.Set} Difference
         */
        subtractFrom: function (set) {
            var localData = this._data,
                remoteData = set._data,
                keys = set.getKeys(),
                keyCount = keys.length,
                i, key,
                result = localData instanceof Array ? [] : {};

            for (i = 0; i < keyCount; i++) {
                key = keys[i];
                if (!hOP.call(localData, key)) {
                    result[key] = remoteData[key];
                }
            }

            return this.getClass(this.__classId).create(result);
        },

        /**
         * Takes symmetric difference between current set and specified set
         * and returns result as a new set.
         * @param {$data.Set} set Set to take symmetric difference with
         * @returns {$data.Set} Difference
         */
        takeDifferenceWith: function (set) {
            var localData = this._data,
                localKeys = this.getKeys(),
                localKeyCount = localKeys.length,
                remoteData = set._data,
                remoteKeys = set.getKeys(),
                remoteKeyCount = remoteKeys.length,
                i, key,
                result = localData instanceof Array ? [] : {};

            for (i = 0; i < remoteKeyCount; i++) {
                key = remoteKeys[i];
                if (!hOP.call(localData, key)) {
                    result[key] = remoteData[key];
                }
            }

            for (i = 0; i < localKeyCount; i++) {
                key = localKeys[i];
                if (!hOP.call(remoteData, key)) {
                    result[key] = localData[key];
                }
            }

            return this.getClass(this.__classId).create(result);
        }
    });

$oop.getClass('$data.DataContainer')
    .delegate(/** @lends $data.DataContainer# */{
        /**
         * @returns {$data.Set}
         */
        toSet: function () {
            return exports.Set.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.Set}
     */
    toSet: function () {
        return exports.Set.create(this);
    }
});
