"use strict";

/**
 * @interface $api.Dispatchable
 */
$api.Dispatchable = $oop.getClass('$api.Dispatchable')
.define(/** @lends $api.Dispatchable# */{
  /**
   * @returns {$utils.Promise}
   */
  dispatch: function () {}
});
