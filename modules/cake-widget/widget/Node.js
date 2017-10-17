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
.blend($utils.Identifiable)
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
   * @param {string} nodeNameBefore
   * @param {string} nodeNameAfter
   * @returns {$widget.Node}
   */
  renameChildNode: function renameChildNode(nodeNameBefore, nodeNameAfter) {
    var childNode = this.getChildNode(nodeNameBefore),
        childNodes = this.childNodes;

    if (childNode) {
      childNodes.deleteItem(nodeNameBefore);
      childNode.setNodeName(nodeNameAfter);
      childNodes.setItem(nodeNameAfter, childNode);
    }

    renameChildNode.saved.childNode = childNode;
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
   * @param {string} nodeName
   * @returns {$widget.Node}
   */
  setNodeName: function setNodeName(nodeName) {
    var nodeNameBefore = this.nodeName,
        parentNode = this.parentNode;

    if (nodeName !== nodeNameBefore) {
      this.nodeName = nodeName;
      if (parentNode) {
        parentNode.renameChildNode(nodeNameBefore, nodeName);
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
