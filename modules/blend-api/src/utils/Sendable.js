"use strict";

/**
 * @interface $api.Sendable
 */
$api.Sendable = $oop.createClass('$api.Sendable')
.define(/** @lends $api.Sendable# */{
  /**
   * @returns {$utils.Promise}
   */
  send: function () {}
})
.build();
