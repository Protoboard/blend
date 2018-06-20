"use strict";

/**
 * @function $buildUtils.DependencySerializer.create
 * @param {Object} [properties]
 * @returns {$buildUtils.DependencySerializer}
 */

/**
 * Serializes a dependency graph.
 * @class $buildUtils.DependencySerializer
 */
$buildUtils.DependencySerializer = $oop.createClass('$buildUtils.DependencySerializer')
.define(/** @lends $buildUtils.DependencySerializer# */{
  /**
   * @member {$data.StringDictionary}
   *     $buildUtils.DependencySerializer#dependencyGraph
   */

  /** @ignore */
  defaults: function () {
    this.dependencyGraph = this.dependencyGraph || $data.StringDictionary.create();
  },

  /**
   * @returns {Array.<string>}
   */
  serialize: function () {
    return [];
  }
})
.build();
