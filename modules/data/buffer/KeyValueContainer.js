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
         * Sets a key-value pair in the container.
         * @param {string} key
         * @param {*} value
         * @returns {$data.KeyValueContainer}
         */
        setItem: function (key, value) {},

        /**
         * Sets multiple key-value pairs in the container.
         * @param {object} items
         * @returns {$data.KeyValueContainer}
         */
        setItems: function (items) {},

        /**
         * Deletes key-value pair from container.
         * @param {string} key
         * @param {*} [value]
         * @returns {$data.KeyValueContainer}
         */
        deleteItem: function (key, value) {},

        /**
         * Deletes multiple key-value pairs from container.
         * @param {object} items
         * @returns {$data.KeyValueContainer}
         */
        deleteItems: function (items) {},

        /**
         * Retrieves the number of key-value pairs in the container.
         * @returns {Number}
         */
        getItemCount: function () {},

        /**
         * Retrieves value(s) for the specified key.
         * @param {string} key
         * @returns {*}
         */
        getValue: function (key) {},

        /**
         * Retrieves a list of all keys in the container.
         * @returns {string[]}
         */
        getKeys: function () {},

        /**
         * Retrieves a list of all values in the container.
         * @returns {Array}
         */
        getValues: function () {},

        /**
         * Returns a key from the container.
         * @returns {string}
         */
        getFirstKey: function () {},

        /**
         * Returns a value from the container.
         * @returns {*}
         */
        getFirstValue: function () {}
    });
