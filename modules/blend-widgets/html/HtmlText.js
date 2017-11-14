"use strict";

/**
 * @mixin $widgets.HtmlText
 * @extends $widget.HtmlWidget
 * @extends $widgets.XmlText
 * @augments $widgets.Text
 */
$widgets.HtmlText = $oop.getClass('$widgets.HtmlText')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$widgets.XmlText'))
.expect($oop.getClass('$widgets.Text'))
.define(/** @lends $widgets.HtmlText# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'span';
  }
});

$oop.getClass('$widgets.Text')
.forwardBlend($widgets.HtmlText, $widget.isHtml);
