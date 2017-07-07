"use strict";

$oop.copyProperties($oop, /** @lends $oop */{
  /**
   * @param {Object} data
   * @param {Array<string>} pathComponents
   * @returns {*}
   * @todo This is a near-duplicate of $data.Tree#getNode
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
   * @param {Object} data
   * @param {Array<string>} pathComponents
   * @param {*} node
   * @todo This is a near-duplicate of $data.Tree#setNode
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
