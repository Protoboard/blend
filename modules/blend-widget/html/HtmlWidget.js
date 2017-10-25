"use strict";

/**
 * @mixin $widget.HtmlWidget
 * @augments $widget.Widget
 * @todo Merge with $widget.HtmlNode?
 */
$widget.HtmlWidget = $oop.getClass('$widget.HtmlWidget')
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

    // todo Should include own class no matter what
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
