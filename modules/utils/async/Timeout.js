"use strict";

/**
 * @function $utils.Timeout.create
 * @param {number} timerId
 * @returns {$utils.Timeout}
 */

/**
 * Represents a timeout ID with promise capabilities.
 * Allows to cancel a timeout via window.clearTimeout.
 * @class $utils.Timeout
 * @extends $utils.Timer
 */
$utils.Timeout = $oop.getClass('$utils.Timeout')
    .extend($oop.getClass('$utils.Timer'))
    .define(/** @lends $utils.Timeout# */{
        /**
         * @inheritDoc
         * @returns {$utils.Timeout}
         */
        clearTimer: function () {
            clearTimeout(this._timerId);
            return this;
        }
    });

/** @external Number */
$oop.copyProperties(Number.prototype, /** @lends external:Number# */{
    /**
     * Converts `Number` to `Timeout` instance.
     * @returns {$utils.Timeout}
     */
    toTimeout: function () {
        return $utils.Timeout.create(this.valueOf());
    }
});
