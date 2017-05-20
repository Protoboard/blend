/* globals $assert, $oop, $utils */
"use strict";

/**
 * @interface $data.Iterable
 */
exports.Iterable = $oop.getClass('$data.Iterable')
    .define(/** @lends $data.Iterable# */{
        /**
         * @param {function} callback
         * @param {object} context
         * @returns {$data.Iterable}
         */
        forEachItem: function (callback, context) {},

        /**
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.Iterable}
         */
        mapValues: function (callback, context) {},

        /**
         * @param {function} callback
         * @param {*} [initialValue]
         * @param {object} [context]
         * @returns {*}
         */
        reduce: function (callback, initialValue, context) {},

        /**
         * @param {function} callback
         * @param {object} [context]
         * @param {number} [argIndex=0]
         * @param {...*} [arg]
         * @returns {$data.Iterable}
         */
        passEachValueTo: function (callback, context, argIndex, arg) {},

        /**
         * @param {string} methodName
         * @param {...*} [arg]
         * @returns {$data.Iterable}
         */
        callOnEachValue: function (methodName, arg) {},

        /**
         * @param {$oop.Class} Class
         * @param {number} [argIndex]
         * @param {...*} [arg]
         * @returns {$data.Iterable}
         */
        createWithEachValue: function (Class, argIndex, arg) {}
    });
