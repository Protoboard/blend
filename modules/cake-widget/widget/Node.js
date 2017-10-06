"use strict";

/**
 * @function $widget.Node.create
 * @returns {$widget.Node}
 */

/**
 * @class $widget.Node
 * @extends $utils.Identifiable
 * @todo Introduce child order. (Separate mixin?)
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
   * @param {string} nodeName
   * @returns {*}
   */
  getChildNode: function (nodeName) {
    return this.childNodes.getValue(nodeName);
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
   * @param {string} nodeNameBefore
   * @param {string} nodeNameAfter
   * @returns {$widget.Node}
   */
  renameChildNode: function (nodeNameBefore, nodeNameAfter) {
    var childNode = this.getChildNode(nodeNameBefore),
        childNodes = this.childNodes;

    if (childNode) {
      childNodes.deleteItem(nodeNameBefore);
      childNode.setNodeName(nodeNameAfter);
      childNodes.setItem(nodeNameAfter, childNode);
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
  },

  /**
   * @param {string} nodeName
   * @returns {$widget.Node}
   */
  setNodeName: function (nodeName) {
    var nodeNameBefore = this.nodeName;
    if (nodeName !== nodeNameBefore) {
      this.nodeName = nodeName;
      this.parentNode.renameChildNode(nodeNameBefore, nodeName);
    }
    return this;
  }
});
