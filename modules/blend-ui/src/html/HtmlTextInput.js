"use strict";

/**
 * @mixin $ui.HtmlTextInput
 * @extend $widget.HtmlWidget
 * @augments $ui.TextInput
 */
$ui.HtmlTextInput = $oop.createClass('$ui.HtmlTextInput')
.blend($widget.HtmlWidget)
.expect($ui.TextInput)
.define(/** @lends $ui.HtmlTextInput# */{
  /** @ignore */
  defaults: function () {
    this.inputType = this.inputType || 'text';
  }
})
.build();

$ui.TextInput
.forwardBlend($ui.HtmlTextInput, $widget.isHtml);

$ui.HtmlTextInput
.forwardBlend($ui.OtherInputTypeHost, function (properties) {
  return !properties.isMultiline;
})
.forwardBlend($ui.TextareaElementHost, function (properties) {
  return properties.isMultiline;
});
