/* globals $assert, $oop, $utils */
"use strict";

/**
 * TODO: Rename to something like KeyValueContainer
 * @interface $data.Manipulable
 */
exports.Manipulable = $oop.getClass('$data.Manipulable')
    .define(/** @lends $data.Manipulable# */{
        /**
         * @param {string} key
         * @param {*} value
         * @returns {$data.Manipulable}
         */
        setItem: function (key, value) {},

        /**
         * @param {object} items
         * @returns {$data.Manipulable}
         */
        setItems: function (items) {},

        /**
         * @param {string} key
         * @param {*} [value]
         * @returns {$data.Manipulable}
         */
        deleteItem: function (key, value) {},

        /**
         * @param {object} items
         * @returns {$data.Manipulable}
         */
        deleteItems: function (items) {}
    });
