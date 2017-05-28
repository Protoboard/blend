/* globals $assert, $oop, $utils, hOP, slice */
"use strict";

/**
 * @function $data.StringPairList.create
 * @param {object|Array} [data]
 * @returns {$data.StringPairList}
 */

/**
 * Key-value container with any-type keys and string values.
 * **Pairs are not unique.**
 * @class $data.StringPairList
 * @extends $data.Collection
 */
exports.StringPairList = $oop.getClass('$data.StringPairList')
    .extend($oop.getClass('$data.Collection'))
    .define(/** @lends $data.StringPairList# */{
        /**
         * @memberOf $data.StringPairList
         * @type {string}
         * @constant
         */
        keyType: exports.KEY_TYPE_ANY,

        /**
         * @memberOf $data.StringPairList
         * @type {string}
         * @constant
         */
        valueType: exports.VALUE_TYPE_STRING
    });

$oop.getClass('$data.DataContainer')
    .delegate(/** @lends $data.DataContainer# */{
        /**
         * @returns {$data.StringPairList}
         */
        toStringPairList: function () {
            return exports.StringPairList.create(this._data);
        }
    });

$oop.copyProperties(Array.prototype, /** @lends external:Array# */{
    /**
     * @returns {$data.StringPairList}
     */
    toStringPairList: function () {
        return exports.StringPairList.create(this);
    }
});
