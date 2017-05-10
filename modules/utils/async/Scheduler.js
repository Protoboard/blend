/* global $oop */
"use strict";

/**
 * @function $utils.Scheduler.create
 * @returns {$utils.Scheduler}
 */

/**
 * Describes classes that schedule function calls.
 * @todo Investigate turning this into a class.
 * @interface $utils.Scheduler
 */
exports.Scheduler = $oop.getClass('$utils.Scheduler')
    .define(/** @lends $utils.Scheduler# */{
        /**
         * @type {function}
         */
        scheduledCallback: {},

        /**
         * @type {Array}
         */
        scheduledCallbackArguments: [],

        /**
         * @type {$utils.Timer[]}
         */
        schedulerTimers: [],

        /**
         * @type {$utils.Deferred}
         */
        schedulerDeferred: {},

        /**
         * @param {number} delay
         * @param {...*} args
         * @returns {$utils.Promise}
         */
        schedule: function (delay, args) {}
    });
