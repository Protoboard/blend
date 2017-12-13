"use strict";

/**
 * @class $widget.HtmlWidget
 * @extends $widget.HtmlNode
 * @augments $widget.Widget
 */
$widget.HtmlWidget = $oop.createClass('$widget.HtmlWidget')
.blend($widget.HtmlNode)
.expect($widget.Widget)
.define(/** @lends $widget.HtmlWidget# */{
  /** @ignore */
  spread: function () {
    this.elementId = this.elementId || 'w' + this.instanceId;
  },

  /** @ignore */
  init: function () {
    this.addCssClass(this.nodeName);
    this._addMixinClasses();
  },

  /**
   * Applies mixin class IDs as CSS classes. Excludes mixins that do not
   * mix or expect `$widget.Widget`.
   * @private
   */
  _addMixinClasses: function () {
    var that = this,
        Widget = $widget.Widget;

    this.__builder.contributors
    .map(function (mixinBuilder) {
      return mixinBuilder.Class;
    })
    .filter(function (Mixin) {
      return Mixin.mixes(Widget) || Mixin.expects(Widget);
    })
    .map($oop.getClassName)
    .forEach(function (className) {
      that.addCssClass(className);
    });
  },

  /**
   * @param {string} nodeName
   * @returns {$widget.HtmlWidget}
   */
  setNodeName: function setChildName(nodeName) {
    var nodeNameBefore = setChildName.shared.nodeNameBefore;
    if (nodeName !== nodeNameBefore) {
      this
      .removeCssClass(nodeNameBefore)
      .addCssClass(nodeName);
    }
    return this;
  }
})
.build();

$widget.Widget
.forwardBlend($widget.HtmlWidget, $widget.isHtml);
