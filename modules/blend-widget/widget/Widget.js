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
    var childNodeBefore = addChildNode.saved.childNodeBefore;
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
    var childNodeBefore = removeChildNode.saved.childNodeBefore;
    if (childNodeBefore && this.isAttached()) {
      childNodeBefore.onDetach();
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
    return parentWidget === $widget.RootWidget.create();
  },

  /** @ignore */
  onAttach: function () {
    this.childNodeLookup.callOnEachValue('onAttach');
  },

  /** @ignore */
  onDetach: function () {
    this.childNodeLookup.callOnEachValue('onDetach');
  }
});

$widget.Widget
.forwardBlend($oop.getClass('$widget.HtmlNode'), $widget.isBrowser)
.forwardBlend($oop.getClass('$widget.HtmlWidget'), $widget.isBrowser)
.forwardBlend($oop.getClass('$widget.DomNode'), $widget.isBrowser);

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
