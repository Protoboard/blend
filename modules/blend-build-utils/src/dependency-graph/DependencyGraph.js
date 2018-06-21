"use strict";

/**
 * @function $buildUtils.DependencyGraph.create
 * @param {Object} [properties]
 * @returns {$buildUtils.DependencyGraph}
 */

/**
 * Models dependencies between things with a string identifier.
 * @class $buildUtils.DependencyGraph
 * @extends $data.StringDictionary
 */
$buildUtils.DependencyGraph = $oop.createClass('$buildUtils.DependencyGraph')
.blend($data.StringDictionary)
.define(/** @lends $buildUtils.DependencyGraph# */{
  /**
   * Filters current dependency graph leaving only edges with a sink node.
   * dependency.
   * @returns {$data.StringDictionary}
   */
  getSinkEdges: function () {
    var that = this;
    return this
    .filter(function (dependency) {
      return that.getValuesForKey(dependency).length === 0;
    });
  },

  /**
   * Removes the specified items (dependant-dependency pairs) from the
   * current instance.
   * @param {$data.ItemContainer|$data.KeyValueContainer} items
   */
  deleteEdgesForSourceNodes: function (items) {
    var that = this;
    items.forEachItem(function (dependency, dependent) {
      that.deleteItem(dependent, dependency);
    });
    return this;
  },

  /**
   * Serializes nodes of the graph so that dependencies precede dependants.
   * Throws on circular dependency.
   * @returns {Array.<string>}
   */
  serialize: function () {
    var clone = this.clone(),
        leafDependencies,
        result = [],
        pushToResult = result.push.bind(result);

    // Adding special entry that has all items as dependency.
    // Necessary to include top-level items.
    clone.getKeys()
    .forEach(function (key) {
      clone.setItem('_', key);
    });

    while ((leafDependencies = clone.getSinkEdges()).getItemCount() > 0) {
      // Deleting leaf dependency relationships
      clone.deleteEdgesForSourceNodes(leafDependencies);

      // Adding leaf dependencies to result
      leafDependencies.swapKeysAndValues()
      .asStringSet()
      .forEachItem(pushToResult);
    }

    $assert.assert(clone.getItemCount() === 0, "Circular dependencies");

    return result;
  }
})
.build();
