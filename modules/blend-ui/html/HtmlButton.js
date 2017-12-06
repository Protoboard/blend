"use strict";

/**
 * @mixin $ui.HtmlButton
 * @extend $widget.HtmlWidget
 * @extend $widget.DisabledAttributeHost
 * @augments $ui.Button
 */
$ui.HtmlButton = $oop.createClass('$ui.HtmlButton')
.blend($widget.HtmlWidget)
.blend($ui.DisabledAttributeHost)
.expect($ui.Button)
.define(/** @lends $ui.HtmlButton# */{
  /** @ignore */
  defaults: function () {
    this.elementName = this.elementName || 'button';
  }
})
.build();

$ui.Button
.forwardBlend($ui.HtmlButton, $widget.isHtml);
