"use strict";

/**
 * @function $widget.Widget.create
 * @param {Object} [properties]
 * @param {string} [properties.nodeName]
 * @param {string} [properties.subscriberId]
 * @returns {$widget.Widget}
 */

/**
 * @class $widget.Widget
 * @extends $widget.Node
 * @extends $utils.Retrievable
 * @extends $event.EventSender
 * @extends $event.EventListener
 * @extends $event.EventSubscriber
 * @implements $utils.Destructible
 */
$widget.Widget = $oop.getClass('$widget.Widget')
.blend($oop.getClass('$widget.Node'))
.blend($utils.Retrievable)
.blend($event.EventSender)
.blend($event.EventListener)
.blend($event.EventSubscriber)
.define(/** @lends $widget.Widget# */{
  /** @ignore */
  spread: function () {
    this.nodeName = this.nodeName || String(this.instanceId);
    this.subscriberId = this.subscriberId || String(this.instanceId);
  },

  /**
   * @param {$widget.Widget} node
   * @returns {$widget.Widget}
   */
  addChildNode: function addChildNode(node) {
    var childNodeBefore = addChildNode.shared.childNodeBefore;
    if (childNodeBefore !== node && this.isAttached()) {
      node.onAttach();
    }
    return this;
  },

  /**
   * @param {string} childNodeName
   * @returns {$widget.Widget}
   */
  removeChildNode: function removeChildNode(childNodeName) {
    var childNodeBefore = removeChildNode.shared.childNodeBefore;
    if (childNodeBefore && this.isAttached()) {
      childNodeBefore.onDetach();
    }
    return this;
  },

  /**
   * @param {$widget.Widget} node
   * @returns {$widget.Widget}
   */
  addToParentNode: function addToParentNode(node) {
    var parentNodeBefore = addToParentNode.shared.parentNodeBefore;
    if (node !== parentNodeBefore) {
      if (parentNodeBefore && parentNodeBefore.isAttached()) {
        this.removeEventPaths(parentNodeBefore.getNodePath().unshift('widget'));
      }
      if (node.isAttached()) {
        this.addEventPaths(node.getNodePath().unshift('widget'));
      }
    }
    return this;
  },

  /**
   * @returns {$widget.Widget}
   */
  removeFromParentNode: function removeFromParentNode() {
    var parentNodeBefore = removeFromParentNode.shared.parentNodeBefore;
    if (parentNodeBefore && parentNodeBefore.isAttached()) {
      this.removeEventPaths(parentNodeBefore.getNodePath().unshift('widget'));
    }
    return this;
  },

  /**
   * @param {$data.Path} parentNodePath
   * @returns {$widget.Widget}
   * @ignore
   */
  addEventPaths: function (parentNodePath) {
    var parentNodePathStr = parentNodePath.toString(),
        nodePath = parentNodePath.push(String(this.nodeName)),
        nodePathStr = nodePath.toString();

    this
    .setListeningPath(nodePathStr)
    .addTriggerPath(nodePathStr)
    .addTriggerPath(parentNodePathStr)
    .addTriggerPath('widget');

    this.childNodeLookup.callOnEachValue('addEventPaths', nodePath);

    return this;
  },

  /**
   * @param {$data.Path} parentNodePath
   * @returns {$widget.Widget}
   * @ignore
   */
  removeEventPaths: function (parentNodePath) {
    var parentNodePathStr = parentNodePath.toString(),
        nodePath = parentNodePath.push(String(this.nodeName)),
        nodePathStr = nodePath.toString();

    this
    .setListeningPath(undefined)
    .removeTriggerPath(nodePathStr)
    .removeTriggerPath(parentNodePathStr)
    .removeTriggerPath('widget');

    this.childNodeLookup.callOnEachValue('removeEventPaths', nodePath);

    return this;
  },

  /**
   * @returns {boolean}
   */
  isAttached: function () {
    var parentWidget = this;
    while (parentWidget.parentNode) {
      parentWidget = parentWidget.parentNode;
    }
    return parentWidget === $widget.RootWidget.create();
  },

  /** @ignore */
  onAttach: function () {
    // propagating attach 'event' to children
    this.childNodeLookup.callOnEachValue('onAttach');
  },

  /** @ignore */
  onDetach: function () {
    // unsubscribing from all events subscribed to by current widget
    this.off();

    // propagating detach 'event' to children
    this.childNodeLookup.callOnEachValue('onDetach');
  }
});

$oop.copyProperties(String.prototype, /** @lends String# */{
  /**
   * @returns {$widget.Widget}
   */
  toWidget: function () {
    var elementId = this.valueOf(),
        instanceId = parseInt(elementId.substr(1), 10),
        widget = $widget.Widget.getInstanceById(instanceId);
    return $widget.Widget.mixedBy(widget) ?
        widget :
        undefined;
  }
});
