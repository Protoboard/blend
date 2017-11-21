"use strict";

/**
 * @mixin $ui.HtmlButton
 * @extend $widget.HtmlWidget
 * @extend $widget.DisabledAttributeHost
 * @augments $ui.Button
 */
$ui.HtmlButton = $oop.getClass('$ui.HtmlButton')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$ui.DisabledAttributeHost'))
.expect($oop.getClass('$ui.Button'))
.define(/** @lends $ui.HtmlButton# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'button';
  }
});

$oop.getClass('$ui.Button')
.forwardBlend($ui.HtmlButton, $widget.isHtml);
