"use strict";

/**
 * @mixin $ui.HtmlTextInput
 * @extend $widget.HtmlWidget
 * @extend $widget.DisabledAttributeHost
 * @augments $ui.TextInput
 */
$ui.HtmlTextInput = $oop.getClass('$ui.HtmlTextInput')
.blend($widget.HtmlWidget)
.blend($oop.getClass('$ui.InputElementHost'))
.blend($oop.getClass('$ui.DisabledAttributeHost'))
.blend($oop.getClass('$ui.ValueAttributeHost'))
.expect($oop.getClass('$ui.TextInput'))
.define(/** @lends $ui.HtmlTextInput# */{
  /** @ignore */
  defaults: function () {
    this.inputType = this.inputType || 'text';
  }
});

$oop.getClass('$ui.TextInput')
.forwardBlend($ui.HtmlTextInput, $widget.isHtml);
