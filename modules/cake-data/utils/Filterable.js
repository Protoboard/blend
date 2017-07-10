"use strict";

/**
 * @interface $data.Filterable
 */
$data.Filterable = $oop.getClass('$data.Filterable')
.define(/** @lends $data.Filterable# */{
  /**
   * Filters data set.
   * @returns {$data.Filterable}
   */
  filter: function (callback, context) {}
});
