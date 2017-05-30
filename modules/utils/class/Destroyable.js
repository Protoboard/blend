"use strict";

/**
 * Adds a destroy method for final cleanup of instances.
 * @interface $utils.Destroyable
 */
$utils.Destroyable = $oop.getClass('$utils.Destroyable')
    .define(/** @lends $utils.Destroyable# */{
        /** @returns {$utils.Destroyable} */
        destroy: function () {}
    });
