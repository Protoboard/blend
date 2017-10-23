"use strict";

/**
 * @function $widget.Widget.create
 * @param {Object} properties
 * @param {string} [properties.nodeName]
 * @param {string} [properties.subscriberId]
 * @returns {$widget.Widget}
 */

/**
 * @class $widget.Widget
 * @extends $widget.Node
 * @mixes $widget.HtmlNode
 * @mixes $widget.DomNode
 * @extends $utils.Retrievable
 * @extends $event.EventSender
 * @extends $event.EventListener
 * @extends $event.EventSubscriber
 */
$widget.Widget = $oop.getClass('$widget.Widget')
.blend($oop.getClass('$widget.Node'))
.blendWhen($oop.getClass('$widget.HtmlNode'), $widget.isBrowser)
.blendWhen($oop.getClass('$widget.DomNode'), $widget.isBrowser)
.blend($utils.Retrievable)
.blend($event.EventSender)
.blend($event.EventListener)
.blend($event.EventSubscriber)
.define(/** @lends $widget.Widget# */{
  /** @ignore */
  spread: function () {
    this.elementId = this.elementId || 'w' + this.instanceId;
    this.nodeName = this.nodeName || this.elementId;
    this.subscriberId = this.subscriberId || this.elementId;
  },

  /** @ignore */
  init: function () {
    this._updateNodeNameClass();
    this._updateMixinClasses();
  },

  /** @private */
  _updateNodeNameClass: function () {
    var nodeName = this.nodeName;
    if (nodeName) {
      this.addCssClass(nodeName);
    }
  },

  /**
   * Applies mixin class IDs as CSS classes. Excludes mixins that do not
   * mix or expect `$widget.Widget`.
   * @private
   */
  _updateMixinClasses: function () {
    var that = this,
        Widget = $widget.Widget;

    this.__contributors.list
    .filter(function (Mixin) {
      return Mixin.mixes(Widget) || Mixin.expects(Widget);
    })
    .map($oop.getClassId)
    .forEach(function (classId) {
      that.addCssClass(classId);
    });
  }
});
