"use strict";

/**
 * @interface $api.Dispatchable
 */
$api.Dispatchable = $oop.createClass('$api.Dispatchable')
.define(/** @lends $api.Dispatchable# */{
  /**
   * @returns {$utils.Promise}
   */
  dispatch: function () {}
})
.build();
