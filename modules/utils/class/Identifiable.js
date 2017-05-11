/* global $oop, $utils */
"use strict";

/**
 * Endows instances of the host class with a unique identifier.
 * @mixin $utils.Identifiable
 */
exports.Identifiable = $oop.getClass('$utils.Identifiable')
    .define(/** @lends $utils.Identifiable# */{
        /**
         * @memberOf $utils.Identifiable
         * @type {number}
         */
        lastInstanceId: -1,

        /** @ignore */
        init: function () {
            /**
             * Identifies instance globally.
             * @type {number}
             */
            this.instanceId = ++exports.Identifiable.lastInstanceId;
        }
    });
