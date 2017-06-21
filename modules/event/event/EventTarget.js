"use strict";

/**
 * Describes a class that is able to intercept events.
 * @interface $event.EventTarget
 */
$event.EventTarget = $oop.getClass('$event.EventTarget')
    .define(/** @lends $event.EventTarget# */{
        /**
         * @param {string} eventName
         * @param {function} callback
         * @returns {$event.EventTarget}
         */
        on: function (eventName, callback) {},

        /**
         * @param {string} eventName
         * @param {function} callback
         * @returns {$event.EventTarget}
         */
        off: function (eventName, callback) {}
    });
