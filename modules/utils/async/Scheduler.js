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
        /** @type {number} */
        scheduleDelay: 0,

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
        scheduleTimers: [],

        /**
         * @type {$utils.Deferred}
         */
        schedulerDeferred: {},

        /**
         * @param {...*} args
         * @returns {$utils.Promise}
         */
        schedule: function (args) {}
    });
