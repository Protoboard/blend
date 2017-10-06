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
      node.addToParentNode(this);
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
      childNode.removeFromParentNode();
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
    if (node !== this.parentNode) {
      this.parentNode = node;
      node.addChildNode(this);
    }
    return this;
  },

  /**
   * @returns {$widget.Node}
   */
  removeFromParentNode: function () {
    var parentNode = this.parentNode;
    if (parentNode) {
      this.parentNode = undefined;
      parentNode.removeChildNode(this.nodeName);
    }
    return this;
  },

  /**
   * @param {string} nodeName
   * @returns {$widget.Node}
   */
  setNodeName: function (nodeName) {
    var nodeNameBefore = this.nodeName,
        parentNode = this.parentNode;
    if (nodeName !== nodeNameBefore) {
      this.nodeName = nodeName;
      if (parentNode) {
        parentNode.renameChildNode(nodeNameBefore, nodeName);
      }
    }
    return this;
  },

  /**
   * @returns {$data.Path}
   */
  getNodePath: function () {
    var node = this,
        components = [];

    while (node) {
      components.unshift(String(node.instanceId));
      node = node.parentNode;
    }

    return $data.Path.fromComponents(components);
  },

  /**
   * @returns {Array.<$widget.Node>}
   */
  getParentNodes: function () {
    var parentNode = this.parentNode,
        result = [];

    while (parentNode) {
      result.push(parentNode);
      parentNode = parentNode.parentNode;
    }

    return result;
  },

  /**
   * @param {function} callback
   * @returns {$widget.Node}
   */
  getClosestParentNode: function (callback) {
    var parentNode = this.parentNode;
    while (parentNode && !callback(parentNode)) {
      parentNode = parentNode.parentNode;
    }
    return parentNode;
  },

  /**
   * @returns {Array.<$widget.Node>}
   */
  getAllChildNodes: function () {
    var result = [];

    (function burrow(parentNode) {
      parentNode.childNodes
      .forEachItem(function (childNode) {
        result.push(childNode);
        burrow(childNode);
      });
    }(this));

    return result;
  }
});
