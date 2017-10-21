"use strict";

/**
 * @mixin $widget.ParentOnlyNode
 * @augments $widget.Node
 */
$widget.ParentOnlyNode = $oop.getClass('$widget.ParentOnlyNode')
.expect($oop.getClass('$widget.Node'))
.define(/** @lends $widget.ParentOnlyNode# */{
  /**
   * @param {$widget.Node} node
   */
  addToParentNode: function (node) {
    $assert.fail("Node can't have parent");
  },

  removeFromParentNode: function () {
    $assert.fail("Node can't have parent");
  },

  /**
   * @param {number} nodeOrder
   */
  setNodeOrder: function (nodeOrder) {
    $assert.fail("Node can't have children");
  },

  getNextSibling: function () {
    $assert.fail("Node can't have parent");
  },

  getPreviousSibling: function () {
    $assert.fail("Node can't have parent");
  },

  getParentNodes: function () {
    $assert.fail("Node can't have parent");
  },

  getClosestParentNode: function () {
    $assert.fail("Node can't have parent");
  }
});
