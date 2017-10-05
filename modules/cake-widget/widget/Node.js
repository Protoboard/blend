"use strict";

/**
 * @function $widget.Node.create
 * @returns {$widget.Node}
 */

/**
 * @class $widget.Node
 * @extends $utils.Identifiable
 */
$widget.Node = $oop.getClass('$widget.Node')
.mix($utils.Identifiable)
.define(/** @lends $widget.Node# */{
  /**
   * @member {$widget.Node} $widget.Node#parentNode
   */

  /**
   * @member {string} $widget.Node#nodeName
   */

  /**
   * @member {$data.Collection} $widget.Node#childNodes
   */

  /** @ignore */
  spread: function () {
    this.nodeName = this.nodeName || String(this.instanceId);
    this.childNodes = this.childNodes || $data.Collection.create();
  },

  /**
   * @param {$widget.Node} node
   * @returns {$widget.Node}
   */
  addChildNode: function (node) {
    var parentNodeBefore = node.parentNode,
        childNodeName = node.nodeName,
        childNodeBefore;

    if (parentNodeBefore !== this) {
      if (parentNodeBefore) {
        // removing node from existing parent
        parentNodeBefore.removeChildNode(childNodeName);
      }

      childNodeBefore = this.childNodes.getValue(childNodeName);
      if (childNodeBefore) {
        // removing conflicting child node
        this.removeChildNode(childNodeName);
      }

      this.childNodes.setItem(childNodeName, node);
      node.parentNode = this;
    }

    return this;
  },

  /**
   * @param nodeName
   * @returns {$widget.Node}
   */
  removeChildNode: function (nodeName) {
    var childNode = this.childNodes.getValue(nodeName);
    if (childNode) {
      this.childNodes.deleteItem(nodeName);
      childNode.parentNode = undefined;
    }
    return this;
  },

  /**
   * @param {$widget.Node} node
   * @returns {$widget.Node}
   */
  addToParentNode: function (node) {
    node.addChildNode(this);
    return this;
  },

  /**
   * @returns {$widget.Node}
   */
  removeFromParentNode: function () {
    var parentNode = this.parentNode;
    if (parentNode) {
      parentNode.removeChildNode(this.nodeName);
    }
    return this;
  }
});
