"use strict";

/**
 * @mixin $ui.HtmlText
 * @extends $widget.HtmlWidget
 * @extends $ui.TextContentHost
 */
$ui.HtmlText = $oop.getClass('$ui.HtmlText')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$ui.TextContentHost'))
.define(/** @lends $ui.HtmlText# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'span';
  }
});

$oop.getClass('$ui.Text')
.forwardBlend($ui.HtmlText, $widget.isHtml);
