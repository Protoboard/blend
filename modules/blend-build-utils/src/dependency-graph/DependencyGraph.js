"use strict";

/**
 * @function $buildUtils.DependencyGraph.create
 * @param {Object} [properties]
 * @returns {$buildUtils.DependencyGraph}
 */

/**
 * @class $buildUtils.DependencyGraph
 * @extends $data.StringDictionary
 */
$buildUtils.DependencyGraph = $oop.createClass('$buildUtils.DependencyGraph')
.blend($data.StringDictionary)
.define(/** @lends $buildUtils.DependencyGraph# */{
  /**
   * TODO: Doesn't have to be StringPairList?
   * @returns {$data.StringDictionary}
   */
  getIndependent: function () {
    var that = this;
    return this
    .filter(function (dependency) {
      return that.getValuesForKey(dependency).length === 0;
    });
  },

  /**
   * @param {$data.ItemContainer|$data.KeyValueContainer} pairs
   */
  deletePairs: function (pairs) {
    var that = this;
    pairs.forEachItem(function (dependency, dependent) {
      that.deleteItem(dependent, dependency);
    });
    return this;
  },

  /**
   * @returns {Array.<string>}
   */
  serialize: function () {
    var clone = this.clone(),
        independent,
        result = [];

    console.log("serializing", JSON.stringify(clone));
    while ((independent = clone.getIndependent()).getItemCount() > 0) {
      console.log("independent", JSON.stringify(independent.data));

      clone.deletePairs(independent);

      // TODO: Extract unique dependencies and push those
      //result.push(independent);
    }

    return result;
  }
})
.build();
