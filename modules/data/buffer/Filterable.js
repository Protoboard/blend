/* globals $assert, $oop, $utils */
"use strict";

/**
 * @interface $data.Filterable
 */
exports.Filterable = $oop.getClass('$data.Filterable')
    .define(/** @lends $data.Filterable# */{
        /**
         * @param {string[]|number[]} keys
         * @returns {$data.Filterable}
         */
        filterByKeys: function (keys) {},

        /**
         * @param {string} prefix
         * @returns {$data.Filterable}
         */
        filterByKeyPrefix: function (prefix) {},

        /**
         * @param {RegExp} regExp
         * @returns {$data.Filterable}
         */
        filterByKeyRegExp: function (regExp) {},

        /**
         * @param {string|function|Object|$oop.Class} type
         * @returns {$data.Filterable} Filtered collection
         */
        filterByType: function (type) {},

        /**
         * @param {function} callback
         * @param {object} [context]
         * @returns {$data.Filterable}
         */
        filterBy: function (callback, context) {}
    });
