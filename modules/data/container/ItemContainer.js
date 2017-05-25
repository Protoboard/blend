/* globals $assert, $oop, $utils */
"use strict";

/**
 * Describes an API for accessing & manipulating key-value pairs.
 * A key-value pair is referred to as "item".
 * @interface $data.ItemContainer
 */
exports.ItemContainer = $oop.getClass('$data.ItemContainer')
    .define(/** @lends $data.ItemContainer# */{
        /**
         * @member {string} $data.ItemContainer.keyType
         */

        /**
         * @member {string} $data.ItemContainer.valueType
         */

        /**
         * Sets a key-value pair in the container.
         * @param {string} key
         * @param {*} value
         * @returns {$data.ItemContainer}
         */
        setItem: function (key, value) {},

        /**
         * Deletes key-value pair from container.
         * @param {string} key
         * @param {*} [value]
         * @returns {$data.ItemContainer}
         */
        deleteItem: function (key, value) {},

        /**
         * Retrieves value(s) for the specified key.
         * @param {string} key
         * @returns {*}
         */
        getValue: function (key) {},

        /**
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.Iterable}
         */
        forEachItem: function (callback, context) {}
    });
