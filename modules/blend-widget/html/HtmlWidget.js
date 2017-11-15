"use strict";

/**
 * @class $widget.HtmlWidget
 * @extends $widget.HtmlNode
 * @augments $widget.Widget
 */
$widget.HtmlWidget = $oop.getClass('$widget.HtmlWidget')
.blend($oop.getClass('$widget.HtmlNode'))
.expect($oop.getClass('$widget.Widget'))
.define(/** @lends $widget.HtmlWidget# */{
  /** @ignore */
  spread: function () {
    this.elementId = this.elementId || 'w' + this.instanceId;
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

    this.__mixins.downstream.list
    .filter(function (Mixin) {
      return Mixin.mixes(Widget) || Mixin.expects(Widget);
    })
    .map($oop.getClassId)
    // including self
    .concat(this.__classId)
    .forEach(function (classId) {
      that.addCssClass(classId);
    });
  }
});

$oop.getClass('$widget.Widget')
.forwardBlend($widget.HtmlWidget, $widget.isHtml);
