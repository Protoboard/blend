"use strict";

/**
 * @function $widget.Node.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @returns {$widget.Node}
 */

/**
 * @class $widget.Node
 * @extends $utils.Identifiable
 */
$widget.Node = $oop.getClass('$widget.Node')
.blend($utils.Identifiable)
.define(/** @lends $widget.Node# */{
  /**
   * Reference to the current node's parent. Nodes cannot belong to more
   * than one parent node. Detached nodes have no parent node specified.
   * @member {$widget.Node} $widget.Node#parentNode
   */

  /**
   * Identifies the node in the context of its parent node.
   * @member {string} $widget.Node#nodeName
   */

  /**
   * Determines where the current node stands among its sibling nodes.
   * @member {number} $widget.Node#nodeOrder
   */

  /**
   * List of references to child nodes. Each child node appears once in
   * `childNodes`.
   * @member {$data.Collection} $widget.Node#childNodes
   */

  /** @ignore */
  spread: function () {
    this.nodeName = this.nodeName || String(this.instanceId);
    this.nodeOrder = this.nodeOrder || 0;
    this.childNodes = this.childNodes || $data.Collection.create();
  },

  /**
   * @param {$widget.Node} node
   * @returns {$widget.Node}
   */
  addChildNode: function addChildNode(node) {
    var parentNodeBefore = node.parentNode,
        childNodeName = node.nodeName,
        childNodeBefore = this.childNodes.getValue(childNodeName);

    if (childNodeBefore !== node) {
      if (parentNodeBefore) {
        // removing node from existing parent
        parentNodeBefore.removeChildNode(childNodeName);
      }

      if (childNodeBefore) {
        // removing conflicting child node
        this.removeChildNode(childNodeName);
      }

      this.childNodes.setItem(childNodeName, node);
      node.addToParentNode(this);
    }

    addChildNode.saved.childNodeBefore = childNodeBefore;
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
  removeChildNode: function removeChildNode(nodeName) {
    var childNodeBefore = this.childNodes.getValue(nodeName);
    if (childNodeBefore) {
      this.childNodes.deleteItem(nodeName);
      childNodeBefore.removeFromParentNode();
    }

    removeChildNode.saved.childNodeBefore = childNodeBefore;
    return this;
  },

  /**
   * @param {$widget.Node} childNode
   * @param {string} nodeName
   * @returns {$widget.Node}
   */
  renameChildNode: function renameChildNode(childNode, nodeName) {
    var nodeNameBefore = childNode.nodeName,
        childNodes = this.childNodes;

    if (nodeName !== nodeNameBefore && childNodes.getValue(childNode.nodeName)) {
      childNodes.deleteItem(nodeNameBefore);
      childNode.setNodeName(nodeName);
      childNodes.setItem(nodeName, childNode);
    }

    renameChildNode.saved.nodeNameBefore = nodeNameBefore;
    return this;
  },

  /**
   * @param {$widget.Node} node
   * @returns {$widget.Node}
   */
  addToParentNode: function addToParentNode(node) {
    var parentNodeBefore = this.parentNode;
    if (node !== parentNodeBefore) {
      this.parentNode = node;
      node.addChildNode(this);
    }

    addToParentNode.saved.parentNodeBefore = parentNodeBefore;
    return this;
  },

  /**
   * @returns {$widget.Node}
   */
  removeFromParentNode: function removeFromParentNode() {
    var parentNodeBefore = this.parentNode;
    if (parentNodeBefore) {
      this.parentNode = undefined;
      parentNodeBefore.removeChildNode(this.nodeName);
    }

    removeFromParentNode.saved.parentNodeBefore = parentNodeBefore;
    return this;
  },

  /**
   * @param {number} nodeOrder
   * @returns {$widget.Node}
   */
  setNodeOrder: function setNodeOrder(nodeOrder) {
    var nodeOrderBefore = this.nodeOrder;

    if (nodeOrder !== nodeOrderBefore) {
      this.nodeOrder = nodeOrder;
    }

    setNodeOrder.saved.nodeOrderBefore = nodeOrderBefore;
    return this;
  },

  /**
   * @param {string} nodeName
   * @returns {$widget.Node}
   */
  setNodeName: function setNodeName(nodeName) {
    var nodeNameBefore = this.nodeName,
        parentNode = this.parentNode;

    if (nodeName !== nodeNameBefore) {
      this.nodeName = nodeName;
      if (parentNode) {
        parentNode.renameChildNode(this, nodeName);
      }
    }

    setNodeName.saved.nodeNameBefore = nodeNameBefore;
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
