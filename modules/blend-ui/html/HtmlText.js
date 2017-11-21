"use strict";

/**
 * @mixin $ui.HtmlText
 * @extends $ui.XmlText
 * @extends $widget.HtmlWidget
 */
$ui.HtmlText = $oop.getClass('$ui.HtmlText')
.blend($oop.getClass('$ui.XmlText'))
.blend($widget.HtmlWidget)
.define(/** @lends $ui.HtmlText# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'span';
  }
});

$oop.getClass('$ui.XmlText')
.forwardBlend($ui.HtmlText, $widget.isHtml);
