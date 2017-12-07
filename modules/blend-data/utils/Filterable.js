"use strict";

/**
 * @interface $data.Filterable
 */
$data.Filterable = $oop.createClass('$data.Filterable')
.define(/** @lends $data.Filterable# */{
  /**
   * Filters data set.
   * @returns {$data.Filterable}
   */
  filter: function (callback, context) {}
})
.build();
