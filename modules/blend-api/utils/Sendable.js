"use strict";

/**
 * @interface $api.Sendable
 */
$api.Sendable = $oop.getClass('$api.Sendable')
.define(/** @lends $api.Sendable# */{
  /**
   * @returns {$utils.Promise}
   */
  send: function () {}
});
