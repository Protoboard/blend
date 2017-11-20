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
   * Ordered list of child nodes.
   * @member {$data.OrderedList} $widget.Node#childNodes
   */

  /**
   * Lookup of child nodes by `nodeName`.
   * @member {$data.Collection} $widget.Node#childNodeLookup
   */

  /**
   * @memberOf $widget.Node
   * @param {string} nodeName
   * @param {Object} [properties]
   * @returns {$widget.Node}
   */
  fromNodeName: function (nodeName, properties) {
    return this.create({nodeName: nodeName}, properties);
  },

  /** @ignore */
  spread: function () {
    var instanceId = this.instanceId,
        nodeName = this.nodeName,
        nodeOrder = this.nodeOrder;

    this.nodeName = nodeName === undefined ?
        String(instanceId) :
        nodeName;
    this.nodeOrder = nodeOrder === undefined ?
        instanceId :
        nodeOrder;
    this.childNodes = this.childNodes || $widget.Nodes.create();
    this.childNodeLookup = this.childNodeLookup || $data.Collection.create();
  },

  /**
   * @param {$widget.Node} node
   * @returns {$widget.Node}
   */
  addChildNode: function addChildNode(node) {
    var parentNodeBefore = node.parentNode,
        childNodeName = node.nodeName,
        childNodeBefore = this.childNodeLookup.getValue(childNodeName);

    if (childNodeBefore !== node) {
      if (parentNodeBefore) {
        // removing node from existing parent
        parentNodeBefore.removeChildNode(childNodeName);
      }

      if (childNodeBefore) {
        // removing conflicting child node
        this.removeChildNode(childNodeName);
      }

      this.childNodeLookup.setItem(childNodeName, node);
      this.childNodes.setItem(node);
      node.addToParentNode(this);
    }

    addChildNode.shared.childNodeBefore = childNodeBefore;
    return this;
  },

  /**
   * @param {string} nodeName
   * @returns {*}
   */
  getChildNode: function (nodeName) {
    return this.childNodeLookup.getValue(nodeName);
  },

  /**
   * Retrieves child node following the specified node.
   * @returns {$widget.Node}
   */
  getNextChild: function (node) {
    var childNodes = this.childNodes,
        index = childNodes.indexOf(node);
    return index > -1 ?
        childNodes.data[index + 1] :
        undefined;
  },

  /**
   * Retrieves child node preceding the specified node.
   * @returns {$widget.Node}
   */
  getPreviousChild: function (node) {
    var childNodes = this.childNodes,
        index = childNodes.indexOf(node);
    return index > -1 ?
        childNodes.data[index - 1] :
        undefined;
  },

  /**
   * @param nodeName
   * @returns {$widget.Node}
   */
  removeChildNode: function removeChildNode(nodeName) {
    var childNodeBefore = this.childNodeLookup.getValue(nodeName);
    if (childNodeBefore) {
      this.childNodeLookup.deleteItem(nodeName);
      this.childNodes.deleteItem(childNodeBefore);
      childNodeBefore.removeFromParentNode();
    }

    removeChildNode.shared.childNodeBefore = childNodeBefore;
    return this;
  },

  /**
   * @param {$widget.Node} childNode
   * @param {string} nodeName
   * @returns {$widget.Node}
   */
  setChildName: function setChildName(childNode, nodeName) {
    var nodeNameBefore = childNode.nodeName,
        childNodeLookup = this.childNodeLookup;

    if (nodeName !== nodeNameBefore &&
        childNodeLookup.hasItem(nodeNameBefore, childNode)
    ) {
      childNodeLookup.deleteItem(nodeNameBefore);
      childNode.setNodeName(nodeName);
      childNodeLookup.setItem(nodeName, childNode);
    }

    setChildName.shared.nodeNameBefore = nodeNameBefore;
    return this;
  },

  /**
   * @param {$widget.Node} childNode
   * @param {number} nodeOrder
   * @returns {$widget.Node}
   */
  setChildOrder: function setChildOrder(childNode, nodeOrder) {
    var nodeOrderBefore = childNode.nodeOrder,
        childNodes = this.childNodes;

    if (nodeOrder !== nodeOrderBefore &&
        this.childNodeLookup.hasItem(childNode.nodeName, childNode)
    ) {
      childNodes.deleteItem(childNode);
      childNode.setNodeOrder(nodeOrder);
      childNodes.setItem(childNode);
    }

    setChildOrder.shared.nodeOrderBefore = nodeOrderBefore;
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

    addToParentNode.shared.parentNodeBefore = parentNodeBefore;
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

    removeFromParentNode.shared.parentNodeBefore = parentNodeBefore;
    return this;
  },

  /**
   * @param {string} nodeName
   * @returns {$widget.Node}
   */
  setNodeName: function setNodeOrder(nodeName) {
    var nodeNameBefore = this.nodeName,
        parentNode = this.parentNode;

    if (nodeName !== nodeNameBefore) {
      this.nodeName = nodeName;
      if (parentNode) {
        parentNode.setChildName(this, nodeName);
      }
    }

    setNodeOrder.shared.nodeNameBefore = nodeNameBefore;
    return this;
  },

  /**
   * @param {number} nodeOrder
   * @returns {$widget.Node}
   */
  setNodeOrder: function setNodeOrder(nodeOrder) {
    var nodeOrderBefore = this.nodeOrder,
        parentNode = this.parentNode;

    if (nodeOrder !== nodeOrderBefore) {
      this.nodeOrder = nodeOrder;
      if (parentNode) {
        parentNode.setChildOrder(this, nodeOrder);
      }
    }

    setNodeOrder.shared.nodeOrderBefore = nodeOrderBefore;
    return this;
  },

  /**
   * Retrieves sibling node following the current node.
   * @returns {$widget.Node}
   */
  getNextSibling: function () {
    var parentNode = this.parentNode;
    return parentNode && parentNode.getNextChild(this);
  },

  /**
   * Retrieves sibling node preceding the current node.
   * @returns {$widget.Node}
   */
  getPreviousSibling: function () {
    var parentNode = this.parentNode;
    return parentNode && parentNode.getPreviousChild(this);
  },

  /**
   * @returns {$data.TreePath}
   */
  getNodePath: function () {
    var node = this,
        components = [];

    while (node) {
      components.unshift(String(node.instanceId));
      node = node.parentNode;
    }

    return $data.TreePath.fromComponents(components);
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
      parentNode.childNodeLookup
      .forEachItem(function (childNode) {
        result.push(childNode);
        burrow(childNode);
      });
    }(this));

    return result;
  }
});
