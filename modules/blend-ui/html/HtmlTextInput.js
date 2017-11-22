"use strict";

/**
 * @mixin $ui.HtmlTextInput
 * @extend $widget.HtmlWidget
 * @augments $ui.TextInput
 */
$ui.HtmlTextInput = $oop.getClass('$ui.HtmlTextInput')
.blend($widget.HtmlWidget)
.expect($oop.getClass('$ui.TextInput'))
.define(/** @lends $ui.HtmlTextInput# */{
  /** @ignore */
  defaults: function () {
    this.inputType = this.inputType || 'text';
  }
});

$oop.getClass('$ui.TextInput')
.forwardBlend($ui.HtmlTextInput, $widget.isHtml);

$ui.HtmlTextInput
.forwardBlend($oop.getClass('$ui.OtherInputTypeHost'), function (properties) {
  return !properties || !properties.isMultiline;
})
.forwardBlend($oop.getClass('$ui.TextareaElementHost'), function (properties) {
  return properties && properties.isMultiline;
});
