"use strict";

/**
 * Describes a structure that can be queried, and a callback to be called on
 * all matches.
 * @interface $data.Queryable
 */
$data.Queryable = $oop.getClass('$data.Queryable')
    .define(/** @lends $data.Queryable# */{
        /**
         * Queries instance according to `expression` and calls `callback`
         * on each match, passing identifier and value of the matching part.
         * @param {*} expression
         * @param {function} callback
         * @returns {$data.Queryable}
         */
        query: function (expression, callback) {}
    });
