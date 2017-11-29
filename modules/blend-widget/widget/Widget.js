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
 * @extends $widget.Stateful
 * @extends $utils.Retrievable
 * @extends $event.EventSender
 * @extends $event.EventListener
 * @extends $event.EventSubscriber
 * @implements $utils.Destructible
 */
$widget.Widget = $oop.getClass('$widget.Widget')
.blend($oop.getClass('$widget.Node'))
.blend($oop.getClass('$widget.Stateful'))
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
   * @param {string} parentNodePath
   * @protected
   */
  _addEventPaths: function (parentNodePath) {
    var nodePath = parentNodePath + '.' + this.instanceId;

    this
    .setListeningPath('widget.' + nodePath)
    .addTriggerPath('widget.' + nodePath)
    .addTriggerPath('widget.' + parentNodePath)
    .addTriggerPath('widget');

    // updating event paths in subtree
    this.childNodeByNodeName.callOnEachValue('_addEventPaths', nodePath);
  },

  /**
   * @param {string} parentNodePath
   * @protected
   */
  _removeEventPaths: function (parentNodePath) {
    var nodePath = parentNodePath + '.' + this.instanceId;

    this
    .setListeningPath(undefined)
    .removeTriggerPath('widget.' + nodePath)
    .removeTriggerPath('widget.' + parentNodePath)
    .removeTriggerPath('widget');

    // updating event paths in subtree
    this.childNodeByNodeName.callOnEachValue('_removeEventPaths', nodePath);
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
        this._removeEventPaths(parentNodeBefore.getNodePath().toString());
      }
      if (node.isAttached()) {
        this._addEventPaths(node.getNodePath().toString());
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
      this._removeEventPaths(parentNodeBefore.getNodePath().toString());
    }
    return this;
  },

  /**
   * @param {string} stateName
   * @param {*} stateValue
   * @returns {$widget.Widget}
   * @todo Belongs in an EventedStateful?
   */
  setStateValue: function setStateValue(stateName, stateValue) {
    var stateValueBefore = setStateValue.shared.stateValueBefore;
    if (stateValue !== stateValueBefore) {
      this.spawnEvent({
        eventName: $widget.EVENT_STATE_CHANGE,
        stateName: stateName,
        stateValueBefore: stateValueBefore,
        stateValueAfter: stateValue
      })
      .trigger();
    }
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
    return $widget.RootWidget.mixedBy(parentWidget);
  },

  /** @ignore */
  onAttach: function () {
    // propagating attach 'event' to children
    this.childNodeByNodeName.callOnEachValue('onAttach');
  },

  /** @ignore */
  onDetach: function () {
    // unsubscribing from all events subscribed to by current widget
    this.off();

    // propagating detach 'event' to children
    this.childNodeByNodeName.callOnEachValue('onDetach');
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
