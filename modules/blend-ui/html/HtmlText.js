"use strict";

/**
 * @mixin $ui.HtmlText
 * @extends $widget.HtmlWidget
 * @extends $ui.TextContentHost
 * @augments $ui.Text
 */
$ui.HtmlText = $oop.getClass('$ui.HtmlText')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$ui.TextContentHost'))
.expect($oop.getClass('$ui.Text'))
.define(/** @lends $ui.HtmlText# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'span';
  }
});

$oop.getClass('$ui.Text')
.forwardBlend($ui.HtmlText, $widget.isHtml);
