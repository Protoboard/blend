"use strict";

$oop.copyProperties($utils, /** @lends $utils */{
    /**
     * Sets up a timeout timer with the specified delay.
     * Similar to window.setTimeout, except that instead of taking a callback
     * the returned timer instance has a promise that is resolved when the timeout completes
     * or is rejected when the timeout gets canceled.
     * Resolution receives timer instance,
     * plus original arguments except delay. Rejection receives arguments
     * passed to {@link $utils.Timeout#clearTimer}. Doesn't get notifications.
     * @param {number} delay
     * @returns {$utils.Timeout}
     * @see window.setTimeout
     */
    setTimeout: function (delay) {
        var proxyArgs = [timeoutCallback].concat(slice.call(arguments)),
            timeout = setTimeout.apply(null, proxyArgs).toTimeout(),
            deferred = timeout.timerDeferred;

        function timeoutCallback() {
            deferred.resolve.apply(deferred, arguments);
        }

        return timeout;
    },

    /**
     * Sets up an interval timer with the specified delay.
     * Similar to window.setInterval, except that instead of taking a callback
     * it returns a promise which is rejected when the interval timer is cleared,
     * and is notified of each interval cycle.
     * Progress receives interval instance,
     * plus original arguments except delay. Rejection receives arguments
     * passed to {@link $utils.Interval#clearTimer}. Never resolves.
     * @param {number} delay
     * @returns {$utils.Interval}
     * @see window.setInterval
     */
    setInterval: function (delay) {
        var proxyArgs = [intervalCallback].concat(slice.call(arguments)),
            interval = setInterval.apply(null, proxyArgs).toInterval(),
            deferred = interval.timerDeferred;

        function intervalCallback() {
            deferred.notify.apply(deferred, arguments);
        }

        return interval;
    }
});
