/* globals $assert, $data, $oop, $utils, slice */
"use strict";

/**
 * @mixin $data.StringKeyHost
 * @augments $data.KeyValueContainer
 */
$data.StringKeyHost = $oop.getClass('$data.StringKeyHost')
    .require($oop.getClass('$data.KeyValueContainer'))
    .define(/** @lends $data.StringKeyHost# */{
        /**
         * @type {string}
         * @constant
         */
        keyType: $data.KEY_TYPE_STRING,

        /**
         * @method $data.StringKeyHost#getValuesForKey
         * @param {string} key
         * @returns {Array}
         */

        /**
         * @param {$data.StringValueHost} leftContainer
         * @returns {$data.KeyValueContainer}
         */
        joinTo: function (leftContainer) {
            var that = this,
                ResultClass = $data.getJoinResultClass(leftContainer, this),
                result = ResultClass.create();

            leftContainer.forEachItem(function (value, key) {
                var values = that.getValuesForKey(value);
                values.forEach(function (value) {
                    result.setItem(key, value);
                });
            });

            return result;
        }
    });
