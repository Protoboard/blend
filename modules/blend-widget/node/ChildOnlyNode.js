"use strict";

/**
 * @mixin $widget.ChildOnlyNode
 * @augments $widget.Node
 */
$widget.ChildOnlyNode = $oop.getClass('$widget.ChildOnlyNode')
.expect($oop.getClass('$widget.Node'))
.define(/** @lends $widget.ChildOnlyNode# */{
  /**
   * @param {$widget.Node} node
   */
  addChildNode: function (node) {
    $assert.fail("Node can't have children");
  },

  /**
   * @param {string} nodeName
   */
  getChildNode: function (nodeName) {
    $assert.fail("Node can't have children");
  },

  /**
   * @param {$widget.Node} node
   */
  getNextChild: function (node) {
    $assert.fail("Node can't have children");
  },

  /**
   * @param {$widget.Node} node
   */
  getPreviousChild: function (node) {
    $assert.fail("Node can't have children");
  },

  /**
   * @param {string} nodeName
   */
  removeChildNode: function (nodeName) {
    $assert.fail("Node can't have children");
  },

  /**
   * @param {$widget.Node} childNode
   * @param {number} nodeOrder
   */
  setChildOrder: function (childNode, nodeOrder) {
    $assert.fail("Node can't have children");
  },

  getAllChildNodes: function () {
    $assert.fail("Node can't have children");
  }
});
