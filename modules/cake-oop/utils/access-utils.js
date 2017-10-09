"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * This is a near-duplicate of $data.Tree#getNode
   * @param {Object} data
   * @param {Array<string>} pathComponents
   * @returns {*}
   */
  getNode: function (data, pathComponents) {
    var pathComponentCount = pathComponents.length,
        result = data,
        i;

    for (i = 0; i < pathComponentCount; i++) {
      result = result[pathComponents[i]];
      if (result === undefined) {
        break;
      }
    }

    return result;
  },

  /**
   * This is a near-duplicate of $data.Tree#setNode
   * @param {Object} data
   * @param {Array<string>} pathComponents
   * @param {*} node
   */
  setNode: function (data, pathComponents, node) {
    var lastPathComponentIndex = pathComponents.length - 1,
        parentNode,
        i, pathComponent, currentNode;

    // adding container nodes
    for (i = 0, parentNode = data; i < lastPathComponentIndex; i++) {
      pathComponent = pathComponents[i];
      currentNode = parentNode[pathComponent];
      if (currentNode === undefined) {
        currentNode = parentNode[pathComponent] = {};
      }
      parentNode = currentNode;
    }

    // setting node on 1st-degree parent
    parentNode[pathComponents[i]] = node;
  }
});
