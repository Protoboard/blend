/* globals $assert, $data, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.PairList.create
 * @param {Array} [data]
 * @returns {$data.PairList}
 */

/**
 * Key-value container with any-type keys and any-type values.
 * **Pairs are not unique.**
 * @class $data.PairList
 * @extends $data.DataContainer
 * @mixes $data.KeyValueContainer
 */
$data.PairList = $oop.getClass('$data.PairList')
    .extend($oop.getClass('$data.DataContainer'))
    .include($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.PairList# */{
        /**
         * @param {Array} data
         * @ignore
         */
        init: function (data) {
            $assert.isArrayOptional(data, "Invalid data buffer");

            /**
             * @type {Array<{key:*,value:*}>}
             * @private
             */
            this._data = data || [];
        },

        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.PairList}
         */
        setItem: function (key, value) {
            this._data.push({
                key: key,
                value: value
            });

            this._itemCount++;

            return this;
        },

        /**
         * @param {string} key
         * @param {*} [value]
         * @returns {$data.PairList}
         */
        deleteItem: function (key, value) {
            $assert.assert(false, [
                this.__classId + "does not support item deletion."
            ].join(" "));
            return this;
        },

        /**
         * @param {function} callback Function to be called for each item
         * @param {object} [context] Context for callback
         * @returns {$data.PairList} Current instance
         */
        forEachItem: function (callback, context) {
            var data = this._data,
                itemCount = data.length,
                i, pair;

            for (i = 0; i < itemCount; i++) {
                pair = data[i];
                if (callback && callback.call(context, pair.value, pair.key, this) === false) {
                    break;
                }
            }

            return this;
        }
    });

$oop.getClass('$data.DataContainer')
    .delegate(/** @lends $data.DataContainer# */{
        /**
         * @returns {$data.PairList}
         */
        toPairList: function () {
            return $data.PairList.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.PairList}
     */
    toPairList: function () {
        return $data.PairList.create(this);
    }
});
