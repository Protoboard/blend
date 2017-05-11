/* global $oop, $utils */
"use strict";

/**
 * Adds a destroy method for final cleanup of instances.
 * @interface $utils.Destroyable
 */
exports.Destroyable = $oop.getClass('$utils.Destroyable')
    .define(/** @lends $utils.Destroyable# */{
        /** @returns {$utils.Destroyable} */
        destroy: function () {}
    });
