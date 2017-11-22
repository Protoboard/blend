"use strict";

/**
 * @mixin $ui.HtmlRadioButton
 * @extends $ui.BinaryInputTypeHost
 * @augments $ui.RadioButton
 */
$ui.HtmlRadioButton = $oop.getClass('$ui.HtmlRadioButton')
.blend($oop.getClass('$ui.BinaryInputTypeHost'))
.expect($oop.getClass('$ui.RadioButton'))
.define(/** @lends $ui.HtmlRadioButton# */{
  /** @ignore */
  defaults: function () {
    this.inputType = this.inputType || 'radio';
  }
});

$oop.getClass('$ui.RadioButton')
.forwardBlend($ui.HtmlRadioButton, $widget.isHtml);