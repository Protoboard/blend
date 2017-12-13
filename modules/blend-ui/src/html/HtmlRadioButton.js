"use strict";

/**
 * @mixin $ui.HtmlRadioButton
 * @extends $ui.BinaryInputTypeHost
 * @augments $ui.RadioButton
 */
$ui.HtmlRadioButton = $oop.createClass('$ui.HtmlRadioButton')
.blend($ui.BinaryInputTypeHost)
.expect($ui.RadioButton)
.define(/** @lends $ui.HtmlRadioButton# */{
  /** @ignore */
  defaults: function () {
    this.inputType = this.inputType || 'radio';
  }
})
.build();

$ui.RadioButton
.forwardBlend($ui.HtmlRadioButton, $widget.isHtml);