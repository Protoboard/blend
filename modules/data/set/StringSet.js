"use strict";

/**
 * @function $data.StringSet.create
 * @param {object|Array} [data]
 * @returns {$data.StringSet}
 */

/**
 * TODO: Should be reducible. (But not mappable.)
 * @class $data.StringSet
 * @extends $data.DataContainer
 * @extends $data.ScalarContainer
 */
$data.StringSet = $oop.getClass('$data.StringSet')
    .extend($oop.getClass('$data.DataContainer'))
    .extend($oop.getClass('$data.ScalarContainer'))
    .define(/** @lends $data.StringSet# */{
        /**
         * @param {string} item
         * @returns {$data.StringSet}
         */
        setItem: function (item) {
            var data = this._data;
            if (!hOP.call(data, item)) {
                data[item] = 1;

                if (this._itemCount !== undefined) {
                    this._itemCount++;
                }
            }
            return this;
        },

        /**
         * @param {string} item
         * @returns {$data.StringSet}
         */
        deleteItem: function (item) {
            var data = this._data;
            if (hOP.call(data, item)) {
                delete data[item];

                if (this._itemCount !== undefined) {
                    this._itemCount--;
                }
            }
            return this;
        },

        /**
         * @param {string} item
         * @returns {boolean}
         */
        hasItem: function (item) {
            return hOP.call(this._data, item);
        },

        /**
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.StringSet}
         */
        forEachItem: function (callback, context) {
            var items = Object.keys(this._data),
                itemCount = items.length,
                i, item;

            for (i = 0; i < itemCount; i++) {
                item = items[i];
                if (callback.call(context || this, item) === false) {
                    break;
                }
            }

            return this;
        },

        /**
         * Intersects current set with specified set and returns the result
         * as a new set.
         * @param {$data.StringSet} set Set to intersect current set with
         * @returns {$data.StringSet} Intersection
         */
        intersectWith: function (set) {
            var result = $oop.getClass(this.__classId).create();
            this.forEachItem(function (item) {
                if (set.hasItem(item)) {
                    result.setItem(item);
                }
            });
            return result;
        },

        /**
         * Unites current set with specified set and returns the result
         * as a new set.
         * @param {$data.StringSet} set Set to unite current set with
         * @returns {$data.StringSet} Union
         */
        uniteWith: function (set) {
            var result = $oop.getClass(this.__classId).create();
            this.forEachItem(function (item) {
                result.setItem(item);
            });
            set.forEachItem(function (item) {
                result.setItem(item);
            });
            return result;
        },

        /**
         * Subtracts specified set from current set and returns difference
         * as a new set.
         * @param {$data.StringSet} set Set to subtract from current set
         * @returns {$data.StringSet} Difference
         */
        subtract: function (set) {
            var result = $oop.getClass(this.__classId).create();
            this.forEachItem(function (item) {
                if (!set.hasItem(item)) {
                    result.setItem(item);
                }
            });
            return result;
        },

        /**
         * Subtracts current set from specified set and returns difference
         * as a new set.
         * @param {$data.StringSet} set Set to subtract current set from
         * @returns {$data.StringSet} Difference
         */
        subtractFrom: function (set) {
            var that = this,
                result = $oop.getClass(this.__classId).create();
            set.forEachItem(function (item) {
                if (!that.hasItem(item)) {
                    result.setItem(item);
                }
            });
            return result;
        },

        /**
         * Takes symmetric difference between current set and specified set
         * and returns result as a new set.
         * @param {$data.StringSet} set Set to take symmetric difference with
         * @returns {$data.StringSet} Difference
         */
        takeDifferenceWith: function (set) {
            var that = this,
                result = $oop.getClass(this.__classId).create();
            this.forEachItem(function (item) {
                if (!set.hasItem(item)) {
                    result.setItem(item);
                }
            });
            set.forEachItem(function (item) {
                if (!that.hasItem(item)) {
                    result.setItem(item);
                }
            });
            return result;
        }
    });

$oop.getClass('$data.DataContainer')
    .delegate(/** @lends $data.DataContainer# */{
        /**
         * @returns {$data.StringSet}
         */
        toStringSet: function () {
            return $data.StringSet.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.StringSet}
     */
    toStringSet: function () {
        return $data.StringSet.create(this);
    }
});
