"use strict";

/**
 * @function $widget.TextNode.create
 * @returns {$widget.TextNode}
 */

/**
 * @class $widget.TextNode
 * @extends $widget.Node
 * @implements $utils.Stringifiable
 */
$widget.TextNode = $oop.getClass('$widget.TextNode')
.blend($oop.getClass('$widget.Node'))
.implement($utils.Stringifiable)
.define(/** @lends $widget.TextNode# */{
  /**
   * @member {string|$utils.Stringifiable} $widget.TextNode#textContent
   */

  /**
   * @memberOf $widget.TextNode
   * @param {string} string
   * @returns {$widget.TextNode}
   */
  fromString: function (string) {
    return this.create({textContent: string});
  },

  /**
   * @memberOf $widget.TextNode
   * @param {string|$utils.Stringifiable} textContent
   * @returns {$widget.TextNode}
   */
  fromTextContent: function (textContent) {
    return this.create({textContent: textContent});
  },

  /**
   * @param {$widget.Node} node
   * @ignore
   */
  addChildNode: function (node) {
    $assert.fail("TextNode can't have children");
  },

  /**
   * @param {string} nodeName
   * @ignore
   */
  getChildNode: function (nodeName) {
    $assert.fail("TextNode can't have children");
  },

  /**
   * @param {$widget.Node} node
   * @ignore
   */
  getNextChild: function (node) {
    $assert.fail("TextNode can't have children");
  },

  /**
   * @param {$widget.Node} node
   * @ignore
   */
  getPreviousChild: function (node) {
    $assert.fail("TextNode can't have children");
  },

  /**
   * @param {string} nodeName
   * @ignore
   */
  removeChildNode: function (nodeName) {
    $assert.fail("TextNode can't have children");
  },

  /**
   * @param {$widget.Node} childNode
   * @param {string} nodeName
   * @ignore
   */
  setChildName: function (childNode, nodeName) {
    $assert.fail("TextNode can't have children");
  },

  /**
   * @param {$widget.Node} childNode
   * @param {number} nodeOrder
   * @ignore
   */
  setChildOrder: function (childNode, nodeOrder) {
    $assert.fail("TextNode can't have children");
  },

  /**
   * @ignore
   */
  getAllChildNodes: function () {
    $assert.fail("TextNode can't have children");
  },

  /** @returns {string} */
  toString: function () {
    return $utils.stringify(this.textContent);
  }
});
