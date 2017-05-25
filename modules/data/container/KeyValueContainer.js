/* globals $assert, $oop, $utils */
"use strict";

/**
 * Describes an API for accessing & manipulating key-value pairs.
 * A key-value pair is referred to as "item".
 * @interface $data.KeyValueContainer
 */
exports.KeyValueContainer = $oop.getClass('$data.KeyValueContainer')
    .define(/** @lends $data.KeyValueContainer# */{
        /**
         * @member {string} $data.KeyValueContainer.keyType
         */

        /**
         * @member {string} $data.KeyValueContainer.valueType
         */

        /**
         * Sets a key-value pair in the container.
         * @param {string} key
         * @param {*} value
         * @returns {$data.KeyValueContainer}
         */
        setItem: function (key, value) {},

        /**
         * Deletes key-value pair from container.
         * @param {string} key
         * @param {*} [value]
         * @returns {$data.KeyValueContainer}
         */
        deleteItem: function (key, value) {},

        /**
         * Retrieves value(s) for the specified key.
         * @param {string} key
         * @returns {*}
         */
        getValue: function (key) {}
    });
